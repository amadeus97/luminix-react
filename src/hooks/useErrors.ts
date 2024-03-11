import React from 'react';
import _ from 'lodash';

import { error } from '@luminix/core';
import { ErrorChangeEvent } from '@luminix/core/dist/types/Error';

import useOn from './useOn';

/**
 * Listen to the error store and return an object with the errors.
 * Returns an object with camelCased keys, suffixed with 'Error'.
 * 
 * ```tsx
 * import { error } from '@luminix/core';
 * import { useErrors } from '@luminix/react';
 * 
 * const {
 *   nameError, emailError, passwordError
 * } = useErrors();
 * 
 * // ...
 * 
 * error().add('name', 'Name is required'); // nameError === 'Name is required'
 * ```
 */
export default function useErrors(): Record<string, string|undefined> {

    // { name: 'Name is required', email: 'Email is required', ...}
    const [errors, setErrors] = React.useState(error().all());

    const handleChange = React.useCallback(({ source }: ErrorChangeEvent) => {
        setErrors(source.all());
    }, []);

    useOn(error(), 'change', handleChange);

    // Clear errors on unmount
    React.useEffect(() => error().clear.bind(error()), []);

    return React.useMemo(() => {
        return Object.entries(errors).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [`${_.camelCase(key)}Error`]: value
            };
        }, {});
    }, [errors]);
}
