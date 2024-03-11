import React from 'react';
import _ from 'lodash';

import { error } from '@luminix/core';
import { ErrorChangeEvent } from '@luminix/core/dist/types/Error';

import useOn from './useOn';

export default function useErrors(): Record<string, string|undefined> {

    // { name: 'Name is required', email: 'Email is required', ...}
    const [errors, setErrors] = React.useState(error().all());

    const handleChange = React.useCallback(({ source }: ErrorChangeEvent) => {
        setErrors(source.all());
    }, []);

    useOn(error(), 'change', handleChange);

    // Clear errors on unmount
    React.useEffect(() => error().clear, []);

    return React.useMemo(() => {
        return Object.entries(errors).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [`${_.camelCase(key)}Error`]: value
            };
        }, {});
    }, [errors]);
}
