
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Select: React.FC<InputProps<'select'>> = (props) => {

    const {
        label, options, ...rest
    } = props;

    const {
        selectProps,
    } = useCurrentForm();

    const {
        [`${_.camelCase(props.name)}Error`]: error,
    } = useErrors();

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
                    {...rest}
                    {...selectProps(props.name)}
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