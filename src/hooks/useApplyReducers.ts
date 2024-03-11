import React from 'react';
import { ReducibleInterface } from '@luminix/core';

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