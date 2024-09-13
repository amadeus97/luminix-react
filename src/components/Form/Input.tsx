import React from 'react';
import { Str } from '@luminix/support';

import { InputProps, InputPropTypeMap } from '../../types/Form';
import useErrors from '../../hooks/useErrors';
import useCurrentForm from '../../hooks/useCurrentForm';
import Forms from '../../facades/Forms';


function Input<T extends keyof InputPropTypeMap>(props: InputProps<T>): React.ReactNode {

    const Component = React.useMemo(() => Forms.getFormInputComponent(props.type as string), [props.type]);

    const { errorBag } = useCurrentForm();

    const {
        [`${Str.camel(props.name)}Error`]: error,
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
