import React from 'react';

import { immer, Func, Obj, DateTime, Response, isValidationError, Client } from '@luminix/support';
import { collect, error, Http, log } from '@luminix/core';

import { UseForm, UseFormOptions } from '../types/Form';
import Forms from '../facades/Forms';
import useCollection from './useCollection';



function handleError(err: unknown, errorBag: string) {
    if (
        isValidationError(err)
    ) {
        const errors = Object.entries(err.json('errors'))
            .reduce((acc, [key, value]) => {
                acc[key] = value.join(', ');
                return acc;
            }, {} as Record<string, string>);

        error().set(errors, errorBag);
    }
}

function returnSelf<T>(obj: T): T {
    return obj;
}

const throttledDebug = Func.throttle((...args: unknown[]) => {
    log().debug(...args);
}, 1000);

/**
 *
 * Creates a form hook that manages form state and handles form submission.
 *
 * @example
 * ```tsx
 * const { formProps, inputProps, checkboxProps } = useForm({ 
 *     initialValues: {
 *         email: '',
 *         password: '',
 *         remember: false,
 *     },
 *     action: route('login'),
 *     method: 'post',
 * });
 *
 * return (
 *   <form {...formProps()}>
 *     <input
 *          type="email"
 *          placeholder="Email"
 *          {...inputProps('email')}
 *     />
 *     <input
 *          type="password" 
 *          placeholder="Password"
 *          {...inputProps('password')}
 *     />
 *     <input
 *          type="checkbox"
 *          id="remember"
 *          {...checkboxProps('remember')}
 *     />
 *     <label htmlFor="remember">Remember me</label>
 *     <button type="submit">Submit</button>
 *   </form>
 * )
 * ```
 *
 */
export default function useForm<T extends object>(options: UseFormOptions<T>): UseForm<T> {

    const {
        initialValues, onSubmit, onChange, onError, onSuccess, action,
        transformPayload = returnSelf, tap = returnSelf, preventDefault = true,
        errorBag = 'default', method, autoSave = false,
        debounce = 1000, debug = false,
    } = options;

    const formRef = React.useRef<HTMLFormElement>();

    const middlewareStorage = React.useRef(collect<(client: Client) => Client>([]));
    const middlewares = useCollection(middlewareStorage.current);

    const [data, setData] = React.useState(initialValues);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedAutoSave = React.useCallback(Func.debounce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_data: T) => {
            if (autoSave) {
                formRef.current?.dispatchEvent(new Event('submit', { 
                    cancelable: true,
                    bubbles: true
                }));
            }
        },
        debounce
    ), [debounce, autoSave]);

    React.useEffect(() => {
        debouncedAutoSave(data);
    }, [debouncedAutoSave, data]);

    React.useEffect(() => {
        if (debug) {
            log().debug(`Form middleware stack resized to ${middlewares.count()}:`, [...middlewares]);
        }
    }, [debug, middlewares]);
    
    return React.useMemo(() => {

        const setProp = (path: string, value: unknown) => {
            setData((data) => {
                const newData = path === '.'
                    ? value as T
                    : immer.produce(data, (draft) => {
                        Obj.set(draft, path, value);
                    });
    
                if (onChange) {
                    onChange(newData);
                }
    
                if (debug) {
                    throttledDebug('Form data changed', {
                        form: formRef.current,
                        path,
                        value,
                        data: newData,
                        prev: data,
                    });
                }
    
                return newData;
            });
        };
        
        const inputProps = <T extends { value?: string }>(name: string, sanitizeFn = (e: React.ChangeEvent<T>) => e.target.value) => ({
            name,
            value: Obj.get(data, name, '') ?? '',
            onChange: (e: React.ChangeEvent<T>) => {
                setProp(name, sanitizeFn(e));
            },
        });

        const datetimeLocalProps = (name: string) => ({
            name,
            value: (() => {
                const value: Date | string | null | undefined = Obj.get(data, name);

                if (value) {

                    return DateTime.toDateTimeLocal(value);
                }

                return '';
            })(),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                setProp(name, value ? (new Date(value)).toISOString() : null);
            }
        });

        const selectProps = (name: string) => ({
            name,
            value: Obj.get(data, name, '') ?? '',
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setProp(name, e.target.value);
            },
        });
    
        const checkboxProps = (name: string) => ({
            name,
            checked: !!Obj.get(data, name),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setProp(name, e.target.checked);
            },
        });

        const radioProps = (name: string, value: string) => ({
            name,
            value,
            checked: Obj.get(data, name) === value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setProp(name, e.target.value);
            },
        });

        const submit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            try {
                setIsSubmitting(true);
                let submitted: boolean | void = true;
                if (onSubmit) {
                    submitted = await onSubmit(data);
                }
    
                if (false !== submitted && action) {
                    const client = middlewares.reduce((client, middleware) => middleware(client!), Http.getClient());

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const response: Response = await (tap(client!) as any)[method ?? 'get'](action, transformPayload(data));

                    if (response.successful() && onSuccess) {
                        onSuccess(response);
                    } else if (response.failed()) {
                        handleError(response, errorBag);

                        if (onError) {
                            onError(response);
                        }
                    }
                }
            } catch (error) {
                if (onError) {
                    onError(error);
                }
            } finally {
                setIsSubmitting(false);
            }
        };

        const formProps = () => ({
            onSubmit: !preventDefault
                ? undefined
                : submit,
            action,
            method: method?.toUpperCase(),
            ref: formRef as React.MutableRefObject<HTMLFormElement>,
        });

        const subscribe = (middleware: (client: Client) => Client) => {
            middlewareStorage.current.push(middleware);
            return () => {
                const index = middlewares.search(middleware);
                if (typeof index === 'number') {
                    middlewareStorage.current.forget(index);
                }
            };
        };

        return {
            data,
            setProp,
            formProps,
            inputProps,
            textareaProps: inputProps,
            selectProps,
            checkboxProps,
            radioProps,
            datetimeLocalProps,
            subscribe,
            isSubmitting,
            form: formRef.current,
            errorBag,
            ...Forms.expandUseFormProps({}, data)
        };
    }, [
        data, onChange, isSubmitting, onSubmit, action, method, debug,
        transformPayload, onSuccess, errorBag, onError, preventDefault,
        tap, middlewares,
    ]);

}


