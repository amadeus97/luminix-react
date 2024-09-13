
import React from 'react';
import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';
import useErrors from '../../../hooks/useErrors';
import { Str } from '@luminix/support';


const DatetimeLocal: React.FC<InputProps<'datetime-local'>> = (props) => {

    const {
        label, className, ...rest
    } = props;

    const { 
        datetimeLocalProps, errorBag,
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
                            className={`luminix-form-label luminix-form-datetime-local-label`.trim()}
                            htmlFor={props.id}
                        >
                            {label}
                        </label>
                        <br/>
                    </>
                )}
                <input
                    className={`luminix-form-input luminix-form-datetime-local-input ${className ?? ''}`.trim()}
                    {...datetimeLocalProps(props.name)}
                    {...rest}
                    type="datetime-local"
                />
            </p>
            {error && <p className="luminix-form-error">{error}</p>}
        </>
    );
};


export default DatetimeLocal;