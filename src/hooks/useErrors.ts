import React from 'react';

import { error } from '@luminix/core';
import _ from 'lodash';


export default function useErrors(bag = 'default'): Record<string, string> {
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        const off = error().bag(bag).on('change', ({ source }) => {
            setErrors(
                Object.entries(source.all() as Record<string, string>).reduce((acc: Record<string, string>, [key, value]) => {
                    acc[_.camelCase(key + 'Error')] = value;
                    return acc;
                }, {})
            );
        });
        return () => {
            off();
            error().clear(bag);
        };
    }, [bag]);

    return errors;
}
