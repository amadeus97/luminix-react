import React from 'react';
import { EventSource } from '@luminix/core';
import { EventSourceEvents } from '@luminix/core/dist/types/Event';

/**
 * Adds an event listener to the event source during the component lifecycle.
 * 
 * **WARNING**: The callback must be a memoized function, using React.useCallback
 * to avoid unnecessary re-renders.
 * 
 * ```tsx
 * import { useOn, useModelFind } from '@luminix/react';
 * 
 * const Component = () => {
 *     const { item: user } = useModelFind('user', 1);
 * 
 *     const handleChange = React.useCallback(({ source }) => {
 *         console.log('User changed', source);    
 *     }, []);
 *
 *     useOn(user, 'change', handleChange);
 * 
 * }
 * ```
 * 
 */
export default function useOn<S extends EventSource<T>, T extends EventSourceEvents, E extends keyof T>(
    eventSource: S | null,
    eventName: E,
    callback: T[E],
) {
    React.useEffect(() => {
        if (eventSource) {
            return eventSource.on(eventName, callback);
        }
    }, [eventSource, eventName, callback]);
}
