import { ReducibleInterface } from '@luminix/core';
import { ReducerCallback } from '@luminix/core/dist/types/Reducer';
import React from 'react';

/**
 * Adds a reducer to the reducible during the component lifecycle.
 * 
 * **WARNING**: The reducer must be a memoized function, using React.useCallback
 * to avoid unnecessary re-renders.
 * 
 * ```tsx
 * import { model } from '@luminix/core';
 * import { useAddReducer } from '@luminix/react';
 * import _ from 'lodash';
 * 
 * const Component = () => {
 *     const reducer = React.useCallback((value) => {
 *         return _.startCase(value);
 *     }, []);
 * 
 *     useAddReducer(model(), 'modelUserGetNameAttribute', reducer);
 * 
 *     const User = model('user')
 *     const user = new User({ name: 'john doe' });
 *     console.log(user.name); // John Doe
 * }
 * ```
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


