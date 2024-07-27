
import React from 'react';

import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';

export type PaginationContextValue = Partial<ModelPaginatedResponse> & {
    refresh: () => void;
    loading: boolean;
    error: Error | null;
};

const PaginationContext = React.createContext<PaginationContextValue>({
    refresh: () => {},
    loading: false,
    error: new Error('Trying to access QueryContext outside of QueryProvider'),
});

export default PaginationContext;
