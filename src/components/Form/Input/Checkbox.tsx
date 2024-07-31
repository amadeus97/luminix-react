
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
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
                    {...checkboxProps(props.name)}
                    {...rest}
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