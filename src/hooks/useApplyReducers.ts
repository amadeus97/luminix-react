import React from 'react';
import { ReducibleInterface } from '@luminix/core';
import useCollection from './useCollection';
import { Collection } from '@luminix/core/dist/types/Collection';
import { Reducer } from '@luminix/core/dist/types/Reducer';
import { isDraftable, produce } from 'immer';


const transform = (collection: Collection<Reducer>) => {
    return collection.pluck('callback');
};

/**
 * Runs the reducers of a reducible and returns the result.
 * 
 * **WARNING**: Value and params must be memoized using React.useMemo 
 * or a state to avoid unnecessary re-renders or prefer primitive values 
 * or known immutable objects to avoid memoization.
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
        if (isDraftable(value)) {
            return produce(value, (draft) => {
                return reducers.reduce((acc, reducer) => {
                    return reducer(acc, ...params);
                }, draft);
            });
        }
        return reducers.reduce((acc, reducer) => {
            return reducer(acc, ...params);
        }, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reducers, value, ...params]);

    return result;
}