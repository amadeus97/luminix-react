
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Radio: React.FC<InputProps<'radio'>> = (props) => {

    const {
        label, options, id, ...rest
    } = props;

    const {
        radioProps,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors();

    return (
        <>
            {label && (
                <p>
                    <label>
                        {label}
                    </label>
                </p>
            )}
            {options.map(({ value, label }) => (
                <p key={value}>
                    <input
                        {...rest}
                        {...radioProps(props.name, value)}
                        id={`${id}::${value}`}
                    />
                    <label htmlFor={`${id}::${value}`}>
                        {label}
                    </label>
                </p>
            ))}
            {error && <p>{error}</p>}
        </>
    );
};


export default Radio;