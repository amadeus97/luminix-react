import React from 'react';
import { InputProps, InputPropTypeMap } from '../../types/Form';
import { app } from '@luminix/core';
import useErrors from '../../hooks/useErrors';
import useCurrentForm from '../../hooks/useCurrentForm';
import _ from 'lodash';


function Input<T extends keyof InputPropTypeMap>(props: InputProps<T>): React.ReactNode {

    const Component = React.useMemo(() => app('forms').getFormInputComponent(props.type), [props.type]);

    const { errorBag } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors(errorBag);

    return (
        <div className={`luminix-form-control luminix-form-${props.type}-control ${error ? 'luminix-form-control-error' : ''}`}>
            <Component
                {...props}
            />
        </div>
    );
}

Input.displayName = 'Input';

export default Input;
