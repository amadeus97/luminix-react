
import React from 'react';
import { Str } from '@luminix/support';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';


const Select: React.FC<InputProps<'select'>> = (props) => {

    const {
        label, options, className, ...rest
    } = props;

    const {
        selectProps, errorBag,
    } = useCurrentForm();

    const {
        [`${Str.camel(props.name)}Error`]: error,
    } = useErrors(errorBag);

    return (
        <>
            <p>
                {label && (
                    <>
                        <label
                            className={`luminix-form-label luminix-form-select-label`.trim()}
                            htmlFor={props.id}
                        >
                            {label}
                        </label>
                        <br/>
                    </>
                )}
                <select
                    className={`luminix-form-input luminix-form-select-input ${className ?? ''}`.trim()}
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