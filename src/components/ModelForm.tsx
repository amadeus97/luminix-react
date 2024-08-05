import React from 'react';
import _ from 'lodash';
import { JsonObject } from '@luminix/core/dist/types/Support';

import { ModelFormProps } from '../types/Form';
import Form from './Form';
import DefaultFormInputs from './ModelForm/DefaultFormInputs';
import Input from './Form/Input';
import ModelFormContext from '../contexts/ModelFormContext';
import { route } from '@luminix/core';
import useCurrentForm from '../hooks/useCurrentForm';
import Submit from './ModelForm/Submit';

const DEFAULT_GET_SAVE_OPTIONS = () => ({});

function ModelSaveListener(): React.ReactNode {

    const { item } = React.useContext(ModelFormContext);

    const { setProp } = useCurrentForm();

    React.useEffect(() => {
        return item.on('save', () => {
            setProp('.', item.toJson());
        });

    }, [item, setProp]);

    return null;
}

function ModelForm({
    item,
    children,
    onSubmit,
    onSuccess,
    onError,
    getSaveOptions = DEFAULT_GET_SAVE_OPTIONS,
    hideSubmit = false,
    submitText = 'Submit',
    confirmed: confirmedProp = [],
    ...rest
}: ModelFormProps): React.ReactNode {

    const saveRoute = item.getRouteForSave();
    const confirmed = React.useMemo(() => typeof confirmedProp === 'string' ? [confirmedProp] : confirmedProp, [confirmedProp]);

    const handleSubmit: (data: JsonObject) => Promise<false> = React.useCallback(async (data) => {
        let shouldSubmit: boolean | void = true;

        if (onSubmit) {
            shouldSubmit = await onSubmit(data);
        }

        item.fill(data);

        if (false !== shouldSubmit) {

            const { additionalPayload, ...options } = getSaveOptions(data);

            const saveOptions = { 
                additionalPayload: {
                    ...additionalPayload,
                    ..._.pick(data, confirmed.map((key) => `${key}_confirmation`)),
                },
                ...options,
            };

            item.save(saveOptions)
                .then((response) => {
                    if (onSuccess && response) {
                        onSuccess(response);
                    }
                })
                .catch(onError)
        }

        return false;

    }, [item, onSubmit, onSuccess, onError, getSaveOptions, confirmed]);

    return (
        <ModelFormContext.Provider value={{ item }}>
            <Form
                initialValues={item.toJson()}
                onSubmit={handleSubmit}
                action={route().url(saveRoute)}
                method={route().methods(saveRoute)[0]}
                errorBag={item.getErrorBag(item.exists ? 'update' : 'store')}
                {...rest}
            >
                {(data, form) => {
                    if (!children) {
                        return (
                            <>
                                <ModelSaveListener />
                                <DefaultFormInputs confirmed={confirmed} />
                                {!hideSubmit && (
                                    <Submit>{submitText}</Submit>
                                )}
                            </>
                        );
                    }

                    if (typeof children === 'function') {
                        return (
                            <>
                                <ModelSaveListener />
                                {children(data, form)}
                            </>
                        );
                    }

                    return (
                        <>
                            <ModelSaveListener />
                            {children}
                        </>
                    );
                }}
            </Form>
        </ModelFormContext.Provider>
    );

}

ModelForm.Input = Input;
ModelForm.DefaultInputs = DefaultFormInputs;
ModelForm.Submit = Submit;

export default ModelForm;