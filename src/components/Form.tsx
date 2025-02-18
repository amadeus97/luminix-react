import React, { ForwardedRef, ReactNode } from 'react';
import { FormProps } from '../types/Form';
import useForm from '../hooks/useForm';
import FormContext from '../contexts/FormContext';
import Input from './Form/Input';
import { Client } from '@luminix/support';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export interface FormImperativeHandle {
    applyMiddlewares: (client: Client) => Client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormComponent extends React.ForwardRefExoticComponent<FormProps<any> & React.RefAttributes<FormImperativeHandle>> {
    Input: typeof Input;
}

function FormComponent<T extends object>(props: FormProps<T>, ref: ForwardedRef<FormImperativeHandle>): ReactNode {
    const {
        initialValues, onSubmit, onChange, onError, onSuccess,
        action, transformPayload, preventDefault = true, errorBag,
        method, children, autoSave, debounce, debug, className, tap,
        ...rest
    } = props;

    const form = useForm({
        initialValues,
        onSubmit,
        onChange,
        onError,
        onSuccess,
        action,
        transformPayload,
        preventDefault,
        errorBag,
        method,
        autoSave,
        debounce,
        debug,
        tap,
    });

    React.useImperativeHandle(ref, () => ({
        applyMiddlewares: form.applyMiddlewares,
    }), [form.applyMiddlewares]);

    const {
        data, ...formRest
    } = form;

    return (
        <FormContext.Provider value={{ form }}>
            <form
                className={`luminix-form ${className || ''}`.trim()}
                {...rest}
                {...form.formProps()}
            >
                {typeof children === 'function'
                    ? children(data, formRest)
                    : children}
            </form>
        </FormContext.Provider>
    );
}

const Form = React.forwardRef(FormComponent) as FormComponent;

Form.Input = Input;

export default Form;
