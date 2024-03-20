import React from 'react';
import { error } from '@luminix/core';
import { LuminixContext } from '../components/LuminixProvider';

/**
 * Listen to the error store and return an object with the errors.
 * Returns an object with camelCased keys, suffixed with 'Error'.
 * Will clear the errors when the component unmounts.
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
    const { errors } = React.useContext(LuminixContext);

    // Clear errors on unmount
    React.useEffect(() => () => error().clear(), []);

    return errors;
}
