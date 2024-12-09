import React from 'react';
import { FormProps } from '../types/Form';
import useForm from '../hooks/useForm';
import FormContext from '../contexts/FormContext';
import Input from './Form/Input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Form<T extends object>(props: FormProps<T>): React.ReactNode {

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

Form.Input = Input;

export default Form;
