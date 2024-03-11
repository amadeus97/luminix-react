import { ReducibleInterface } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';
import React from 'react';

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


