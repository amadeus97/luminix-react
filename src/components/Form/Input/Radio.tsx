
import React from 'react';
import { Str } from '@luminix/support';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';

const Radio: React.FC<InputProps<'radio'>> = (props) => {

    const {
        label, options, className, id, ...rest
    } = props;

    const {
        radioProps, errorBag,
    } = useCurrentForm();

    const {
        [`${Str.camel(props.name)}Error`]: error,
    } = useErrors(errorBag);

    return (
        <>
            {label && (
                <>
                    <label className="luminix-form-label luminix-form-radio-label" >
                        {label}
                    </label>
                </>
            )}
            {options.map(({ value, label }) => (
                <p key={value}>
                    <input
                        id={id ? `${id}::${value}` : undefined}
                        className={`luminix-form-input luminix-form-radio-input ${className ?? ''}`.trim()}
                        {...radioProps(props.name, value)}
                        {...rest}
                    />
                    <label htmlFor={id ? `${id}::${value}` : undefined}>
                        {label}
                    </label>
                </p>
            ))}
            {error && <p>{error}</p>}
        </>
    );
};


export default Radio;