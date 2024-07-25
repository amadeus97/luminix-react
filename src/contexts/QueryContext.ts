
import React from 'react';
import { Model } from '@luminix/core';
import { ModelPaginatedLink } from '@luminix/core/dist/types/Model';
import { Collection } from '@luminix/core/dist/types/Collection';

export type QueryContextValue = {
    refresh: () => void;
    data?: Collection<Model>;
    links?: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
        links: ModelPaginatedLink[];
    };
    loading: boolean;
    error: Error | null;
    Model: typeof Model;
};

const QueryContext = React.createContext<QueryContextValue>({
    refresh: () => {},
    loading: false,
    error: new Error('Trying to access QueryContext outside of QueryProvider'),
    Model: null as unknown as typeof Model,
});

export default QueryContext;
