import React from 'react';
import { ReducibleInterface } from '@luminix/core';
import useCollection from './useCollection';
import { Collection } from '@luminix/core/dist/contracts/Collection';
import { Reducer } from '@luminix/core/dist/types/Reducer';


const transform = (collection: Collection<Reducer>) => {
    return collection.pluck('callback');
};

/**
 * Applies a reducer to the reducible during the component lifecycle.
 * **WARNING**: Value and params must be memoized using React.useMemo 
 * or a state to avoid unnecessary re-renders. Prefer primitive values 
 * or known immutable objects.
 * 
 * Returns the result of the reducer.
 */
export default function useApplyReducers(
    reducible: ReducibleInterface,
    name: string,
    value: unknown,
    ...params: unknown[]
) {

    const reducers = useCollection(reducible.getReducer(name), transform);

    const result = React.useMemo(() => {
        return reducers.reduce((acc, reducer) => {
            return reducer(acc, ...params);
        }, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reducers, value, ...params]);

    return result;
}