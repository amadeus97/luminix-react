
import React from 'react';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';


const Csrf: React.FC<InputProps<'hidden'>> = (props) => {

    const {
        className, ...rest
    } = props;

    const csrf = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;

    const { subscribe } = useCurrentForm();

    React.useEffect(() => {
        return subscribe((client) => client.withData({
            _token: csrf?.content,
        }));
    }, [csrf?.content, subscribe]);

    return (
        <input
            className={`luminix-form-input luminix-form-${props.type}-input ${className ?? ''}`.trim()}
            {...rest}
            value={csrf?.content}
            name="_token"
        />
    );
};


export default Csrf;