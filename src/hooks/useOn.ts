import React from 'react';
import { EventSource } from '@luminix/core';
import { EventSourceEvents } from '@luminix/core/dist/types/Event';

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
