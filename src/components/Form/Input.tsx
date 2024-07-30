import React from 'react';
import { InputProps, InputPropTypeMap } from '../../types/Form';
import { app } from '@luminix/core';


function Input<T extends keyof InputPropTypeMap>(props: React.PropsWithChildren<InputProps<T>>) {

    const Component = React.useMemo(() => app('forms').getFormInputComponent(props.type), [props.type]);

    return (
        <Component
            {...props}
        />
    );
}

Input.displayName = 'Input';

export default Input;
