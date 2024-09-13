
import React from 'react';
import { Str } from '@luminix/support';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';


const Textarea: React.FC<InputProps<'textarea'>> = (props) => {

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        label, type: __, sanitize, className, ...rest
    } = props;

    const { 
        textareaProps, errorBag,
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
                            className={`luminix-form-label luminix-form-textarea-label`.trim()}
                            htmlFor={props.id}
                        >
                            {label}
                        </label>
                        <br/>
                    </>
                )}
                <textarea
                    className={`luminix-form-input luminix-form-textarea-input ${className ?? ''}`.trim()}
                    {...textareaProps(props.name, sanitize)}
                    {...rest}
                />
            </p>
            {error && <p className="luminix-form-error">{error}</p>}
        </>
    );
};


export default Textarea;