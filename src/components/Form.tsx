import React from 'react';
import { FormProps } from '../types/Form';
import useForm from '../hooks/useForm';
import FormContext from '../contexts/FormContext';
import Input from './Form/Input';

function Form<T extends object>(props: FormProps<T>): React.ReactElement {

    const {
        initialValues, onSubmit, onChange, onError, onSuccess,
        action, transformPayload, preventDefault = true,
        errorBag, method, children, ...rest
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
    });

    return (
        <FormContext.Provider value={form}>
            <form
                {...rest}
                {...form.formProps()}
            >
                {children}
            </form>
        </FormContext.Provider>
    );
}

Form.Input = Input;

export default Form;
