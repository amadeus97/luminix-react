import { ReducibleInterface } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';
import React from 'react';

/**
 * Adds a reducer to the reducible during the component lifecycle.
 * 
 * **WARNING**: The reducer must be a memoized function, using React.useCallback
 * to avoid unnecessary re-renders. 
 * 
 */
export default function useAddReducer(
    reducible: ReducibleInterface,
    name: string,
    reducer: ReducerCallback,
    priority: number = 10,
) {
    React.useEffect(() => {
        return reducible.reducer(name, reducer, priority)
    }, [reducible, name, reducer, priority]);
}


