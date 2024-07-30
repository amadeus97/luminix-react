
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Checkbox: React.FC<InputProps<'checkbox'>> = (props) => {

    const {
        label, ...rest
    } = props;

    const { 
        checkboxProps,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors();

    return (
        <>
            <p>
                <input
                    {...rest}
                    {...checkboxProps(props.name)}
                />
                {label && (
                    <label htmlFor={props.id}>
                        {label}
                    </label>
                )}
            </p>
            {error && <p>{error}</p>}
        </>
    );
};


export default Checkbox;