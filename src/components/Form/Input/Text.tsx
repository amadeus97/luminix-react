
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Text: React.FC<InputProps<'text'>> = (props) => {

    const {
        label, sanitize, ...rest
    } = props;

    const { 
        inputProps,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors();

    return (
        <>
            <p>
                <label htmlFor={props.id}>
                    {label}
                </label>
                <input
                    {...rest}
                    {...inputProps(props.name, sanitize)}
                />
            </p>
            {error && <p>{error}</p>}
        </>
    );
};


export default Text;