
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Textarea: React.FC<InputProps<'textarea'>> = (props) => {

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        label, type: __, sanitize, ...rest
    } = props;

    const { 
        textareaProps, errorBag,
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
                <textarea
                    {...textareaProps(props.name, sanitize)}
                    {...rest}
                />
            </p>
            {error && <p>{error}</p>}
        </>
    );
};


export default Textarea;