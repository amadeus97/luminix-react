
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Select: React.FC<InputProps<'select'>> = (props) => {

    const {
        label, options, ...rest
    } = props;

    const {
        selectProps, errorBag,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors(errorBag);

    return (
        <>
            <p>
                {label && (
                    <>
                        <label htmlFor={props.id}>
                            {label}
                        </label>
                        <br/>
                    </>
                )}
                <select
                    {...selectProps(props.name)}
                    {...rest}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </p>
            {error && <p>{error}</p>}
        </>
    );
};


export default Select;