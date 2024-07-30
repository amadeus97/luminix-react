
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import _ from 'lodash';


const Textarea: React.FC<InputProps<'textarea'>> = (props) => {

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        label, type: __, sanitize, ...rest
    } = props;

    const { 
        textareaProps,
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
                <textarea
                    {...rest}
                    {...textareaProps(props.name, sanitize)}
                />
            </p>
            {error && <p>{error}</p>}
        </>
    );
};


export default Textarea;