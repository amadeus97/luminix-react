import React from 'react';
import { ReducibleInterface } from '@luminix/core';

/**
 * Applies a reducer to the reducible during the component lifecycle.
 * **WARNING**: The reducer must be a memoized function, using React.useCallback
 * to avoid unnecessary re-renders. Value and params must be memoized as well with
 * React.useMemo or using a state. For the params, prefer primitive values or 
 * known immutable objects.
 * 
 * Returns the result of the reducer.
 */
export default function useApplyReducers(
    reducible: ReducibleInterface,
    name: string,
    value: unknown,
    ...params: unknown[]
) {

    return React.useMemo(() => {
        const reducer = reducible[name];
        if (typeof reducer !== 'function') {
            throw new Error(`Expect ${reducible} to be Reducible`);
        }
        return reducer(value, ...params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reducible, name, value, ...params]);
}