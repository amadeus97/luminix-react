
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Radio: React.FC<InputProps<'radio'>> = (props) => {

    const {
        label, options, className, id, ...rest
    } = props;

    const {
        radioProps, errorBag,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
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