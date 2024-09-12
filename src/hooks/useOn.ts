import { Event, EventSource } from '@luminix/support';

import React from 'react';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useOn(
    eventSource: EventSource | null,
    eventName: string,
    callback: (e: Event) => void,
) {
    React.useEffect(() => {
        if (eventSource) {
            return eventSource.on(eventName, callback);
        }
    }, [eventSource, eventName, callback]);
}
