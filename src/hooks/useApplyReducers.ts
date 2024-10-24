import React from 'react';
import {
    ReducibleInterface, Collection, ReducerCallback,
    immer,
} from '@luminix/support';
import useCollection from './useCollection';

const transform = (collection: Collection<{ callback: ReducerCallback, priority: number }>) => {
    return collection.pluck('callback');
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type First<T extends any[]> = T extends [infer A, ...any] ? A : unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : unknown[];

/**
 * Runs the reducers of a reducible and returns the result.
 * 
 * **WARNING**: Value and params must be memoized using React.useMemo 
 * or a state to avoid unnecessary re-renders or prefer primitive values 
 * or known immutable objects to avoid memoization.
 * 
 * Returns the result of the reducer.
 */
export default function useApplyReducers<TReducers extends Record<string, ReducerCallback>, K extends keyof TReducers>(
    reducible: ReducibleInterface<TReducers>,
    name: K,
    value: First<Parameters<TReducers[K]>>,
    ...params: Tail<Parameters<TReducers[K]>>
) {

    const reducers = useCollection(reducible.getReducer(name), transform);

    const result = React.useMemo(() => {
        if (immer.isDraftable(value)) {
            return immer.produce(value, (draft: unknown) => {
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
