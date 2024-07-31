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


function ModelForm({
    item,
    children,
    onChange,
    fillOnChange = false,
    ...rest
}: ModelFormProps): React.ReactNode {

    const onChangeWithFill = useFillOnChange(item, onChange);

    return (
        <ModelFormContext.Provider value={{ item }}>
            <Form
                initialValues={item.toJson()}
                onChange={fillOnChange ? onChangeWithFill : onChange}
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