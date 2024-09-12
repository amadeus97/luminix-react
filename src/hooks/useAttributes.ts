import { Str } from '@luminix/support';
import { ModelType as Model } from '@luminix/core';
import React from 'react';

import useOn from './useOn';


type UseAttributesOptions = {
    cast?: boolean;
};

const castAttributes = (item: Model) => {
    return Object.keys(item.attributes).reduce((acc, key) => {
        return {
            ...acc,
            [Str.camel(key)]: item[key],
        };
    }, {});
};

/**
 * Hook to get the attributes of a model. Will listen to the change event of the model and update the attributes accordingly.
 * 
 * Usage:
 * ```tsx
 * import { useAttributes } from '@luminix/react';
 * 
 * const {
 *    name, email, password
 * } = useAttributes(user);
 * ```
 * 
 * @param item The model to get the attributes from
 * @param options Options
 * @param options.cast If `true`, the attributes will be casted according to the model's `$casts` property and pass through the model's reducers. Default is `true`.
 * 
 */
export default function useAttributes(item: Model, options: UseAttributesOptions = {}) {

    const {
        cast = true,
    } = options;

    const [attributes, setAttributes] = React.useState(
        cast 
            ? castAttributes(item)
            : item.attributes
    );

    const handleChange = React.useCallback(() => {
        setAttributes(
            cast 
                ? castAttributes(item)
                : item.attributes
        );
    }, [item, cast]);

    useOn(item, 'change', handleChange);

    return attributes;
}
