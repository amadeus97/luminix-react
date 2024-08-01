import React from 'react';
import { Model } from '@luminix/core';
import { JsonObject } from '@luminix/core/dist/types/Support';

import { ModelFormProps } from '../types/Form';
import Form from './Form';
import DefaultFormInputs from './ModelForm/DefaultFormInputs';
import Input from './Form/Input';
import ModelFormContext from '../contexts/ModelFormContext';

function useFillOnChange(item: Model, onChange?: (data: JsonObject) => void) {
    return React.useCallback((data: JsonObject) => {
        item.fill(data);
        if (onChange) {
            onChange(data);
        }
    }, [item, onChange]);
}

const DEFAULT_GET_SAVE_OPTIONS = () => ({});


function ModelForm({
    item,
    children,
    onChange,
    onSubmit,
    onSuccess,
    onError,
    getSaveOptions = DEFAULT_GET_SAVE_OPTIONS,
    fillOnChange = false,
    ...rest
}: ModelFormProps): React.ReactNode {

    const onChangeWithFill = useFillOnChange(item, onChange);

    const handleSubmit: (data: JsonObject) => Promise<false> = React.useCallback(async (data) => {
        let shouldSubmit: boolean | void = true;

        if (onSubmit) {
            shouldSubmit = await onSubmit(data);
        }

        item.fill(data);

        if (false !== shouldSubmit) {
            const options = getSaveOptions(data);
            item.save(options)
                .then(onSuccess)
                .catch(onError)
        }

        return false;
    }, [item, onSubmit, onSuccess, onError, getSaveOptions]);

    return (
        <ModelFormContext.Provider value={{ item }}>
            <Form
                initialValues={item.toJson()}
                onChange={fillOnChange ? onChangeWithFill : onChange}
                onSubmit={handleSubmit}
                {...rest}
            >
                {(data, form) => {
                    if (!children) {
                        return (
                            <>
                                <DefaultFormInputs />
                                <button type="submit">Submit</button>
                            </>
                        );
                    }

                    if (typeof children === 'function') {
                        return children(data, form);
                    }

                    return children;
                }}
            </Form>
        </ModelFormContext.Provider>
    );

}

ModelForm.Input = Input;

ModelForm.DefaultInputs = DefaultFormInputs;

export default ModelForm;