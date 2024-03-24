import React from 'react';

import { EventSource } from '@luminix/core';
import { EventSourceEvents } from '@luminix/core/dist/types/Event';

/**
 * Emits an event on the event source during the component lifecycle.
 * Event will be emitted when the component mounts, and on any
 * parameter change.
 * 
 * **WARNING**: The event data should be a state or a memoized value
 * to avoid unnecessary re-emits.
 * 
 * ```tsx
 * import { useEmit } from '@luminix/react';
 * import MySource from '../events/MySource';
 * 
 * const Component = () => {
 *    const [data, setData] = React.useState('Hello');
 * 
 *    useEmit(MySource, 'greet', data);
 * 
 *    return (
 *         <input
 *             value={data}
 *             onChange={(e) => setData(e.target.value)}
 *         />
 *    );
 * };
 * 
 * ```
 * 
 * @param eventSource 
 * @param eventName 
 * @param data 
 */
export default function useEmit<T extends EventSourceEvents>(
    eventSource: EventSource<T> | null,
    eventName: keyof T,
    data?: Parameters<T[keyof T]>[0]
) {
    React.useEffect(() => {
        if (eventSource) {
            eventSource.emit(eventName, data);
        }
    }, [eventSource, eventName, data]);
}


