
import React from 'react';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';

import useErrors from '../../../hooks/useErrors';
import { Obj, Str } from '@luminix/support';

const File: React.FC<InputProps<'file'>> = (props) => {

    const { subscribe, inputProps, errorBag, } = useCurrentForm();

    React.useEffect(() => {
        return subscribe((client) => client.asForm());
    }, [subscribe]);

    const {
        label, sanitize = (e) => e.target.files,
        className, ...rest
    } = props;

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
                    {...Obj.omit(inputProps(props.name, sanitize), 'value')}
                    {...rest}
                />
            </p>
            {error && <p className="luminix-form-error">{error}</p>}
        </>
    );
};


export default File;