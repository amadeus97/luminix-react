import React from 'react';

import { error } from '@luminix/core';
import { Str } from '@luminix/support';

export default function useErrors(bag = 'default'): Record<string, string> {
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        const off = error().bag(bag).on('change', ({ source }) => {
            setErrors(
                Object.entries(source.all() as Record<string, string>).reduce((acc, [key, value]) => {
                    acc[Str.camel(key + 'Error')] = value;
                    return acc;
                }, {} as Record<string, string>)
            );
        });
        return () => {
            off();
            error().clear(bag);
        };
    }, [bag]);

    return errors;
}
