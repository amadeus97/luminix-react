import React from 'react';
import { error } from '@luminix/core';
import _ from 'lodash';

// Target API

// const { 
//    nameError, emailError, passwordError, passwordVerifyError 
// } = useErrors(['name', 'email', 'password', 'password_verify']);

export default function useValidationErrors(): Record<string, string|undefined> {

    // { name: 'Name is required', email: 'Email is required', ...}
    const [errors, setErrors] = React.useState(error().all());

    React.useEffect(() => {
        const unsubscribe = error().on('change', ({ source }) => {
            setErrors(source.all());
        });

        return () => {
            unsubscribe();
            error().clear();
        };
    }, []);

    return React.useMemo(() => {
        return Object.entries(errors).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [`${_.camelCase(key)}Error`]: value
            };
        }, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);
}
