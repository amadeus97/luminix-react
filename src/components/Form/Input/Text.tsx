
import React from 'react';
import { Str } from '@luminix/support';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';



const Text: React.FC<InputProps<'text'>> = (props) => {

    const {
        label, sanitize, className, ...rest
    } = props;

    const { 
        inputProps, errorBag,
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
                            className={`luminix-form-label luminix-form-${props.type}-label`.trim()}
                            htmlFor={props.id}
                        >
                            {label}
                        </label>
                        <br/>
                    </>
                )}
                <input
                    className={`luminix-form-input luminix-form-${props.type}-input ${className ?? ''}`.trim()}
                    {...inputProps(props.name, sanitize)}
                    {...rest}
                />
            </p>
            {error && <p className="luminix-form-error">{error}</p>}
        </>
    );
};


export default Text;