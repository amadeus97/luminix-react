
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Checkbox: React.FC<InputProps<'checkbox'>> = (props) => {

    const {
        label, className, ...rest
    } = props;

    const { 
        checkboxProps, errorBag,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors(errorBag);

    return (
        <>
            <p>
                <input
                    className={`luminix-form-input luminix-form-checkbox-input ${className ?? ''}`.trim()}
                    {...checkboxProps(props.name)}
                    {...rest}
                />
                {label && (
                    <label
                        htmlFor={props.id}
                        className="luminix-form-label luminix-form-checkbox-label"
                    >
                        {label}
                    </label>
                )}
            </p>
            {error && <p>{error}</p>}
        </>
    );
};


export default Checkbox;