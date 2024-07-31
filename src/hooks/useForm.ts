import React from 'react';
import _ from 'lodash';
import { produce } from 'immer';
import axios, { isAxiosError } from 'axios';

import { app, error, log } from '@luminix/core';
import { UseForm, UseFormOptions } from '../types/Form';



function handleError(err: unknown, errorBag: string) {
    if (
        isAxiosError(err) && err.response?.status === 422
    ) {
        const { data } = err.response;

        const errors = Object.entries(data.errors as Record<string, Array<string>>)
            .reduce((acc, [key, value]) => {
                acc[key] = value.join(', ');
                return acc;
            }, {} as Record<string, string>);

        error().set(errors, errorBag);
    }
}

function defaultTransformPayload<T extends object>(payload: T): T {
    return payload;
}

const throttledDebug = _.throttle((...args: unknown[]) => {
    log().debug(...args);
}, 1000);

/**
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
        transformPayload = defaultTransformPayload, preventDefault = true,
        errorBag = 'default', method = 'get',
    } = options;

    const formRef = React.useRef<HTMLFormElement>();

    const [data, setData] = React.useState(initialValues);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    
    return React.useMemo(() => {

        const setProp = (path: string, value: unknown) => {
            setData((data) => {
                const newData = path === '.'
                    ? value as T
                    : produce(data, (draft) => {
                        _.set(draft, path, value);
                    });
    
                if (onChange) {
                    onChange(newData);
                }
    
                if (app().hasDebugModeEnabled()) {
                    // log().debug('Form data changed', {
                    //     form: formRef.current,
                    //     path,
                    //     value,
                    //     data: newData,
                    //     prev: data,
                    // });
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
        
        const inputProps = (name: string, sanitizeFn = (e: React.ChangeEvent<HTMLInputElement>) => e.target.value) => ({
            name,
            value: _.get(data, name, '') as string,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setProp(name, sanitizeFn(e));
            },
        });

        const selectProps = (name: string) => ({
            name,
            value: _.get(data, name, '') as string,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                setProp(name, e.target.value);
            },
        });
    
        const checkboxProps = (name: string) => ({
            name,
            checked: !!_.get(data, name),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setProp(name, e.target.checked);
            },
        });

        const radioProps = (name: string, value: string) => ({
            name,
            value,
            checked: _.get(data, name) === value,
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
                    const response = await axios({
                        method,
                        url: action,
                        data: transformPayload(data),
                    });
                    if (onSuccess) {
                        onSuccess(response);
                    }
                }
            } catch (error) {
                handleError(error, errorBag);
    
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
            method,
            ref: formRef,
        });


        return app('forms').getUseFormProps({
            data,
            setProp,
            formProps,
            inputProps,
            textareaProps: inputProps,
            selectProps,
            checkboxProps,
            radioProps,
            isSubmitting,
            form: formRef.current,
            errorBag,
        });
    }, [
        data, onChange, isSubmitting, onSubmit, action, method,
        transformPayload, onSuccess, errorBag, onError, preventDefault,
    ]);

}


