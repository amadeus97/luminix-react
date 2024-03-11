import { Model, model } from '@luminix/core';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import React from 'react';

type Paginator = Omit<ModelPaginatedResponse, "data">;

type ModelGetState = Partial<Paginator> & {
    items: Model[] | null;
    loading: boolean;
    error: Error | null;
};

type ModelGetQuery = Record<string, unknown> & {
    q?: string;
    page?: number;
    per_page?: number;
    order_by?: string;
    filters?: Record<string, unknown>;
    tab?: string;
    minified?: boolean;
}

export default function useModelGet(abstract: string | typeof Model, query?: ModelGetQuery) {
    
    const LeModel = React.useMemo(() => typeof abstract === 'string' 
        ? model(abstract) 
        : abstract, [abstract]);

    const [state, setState] = React.useState<ModelGetState>({
        items: null,
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState({ loading: true, error: null, items: null });
        LeModel.get(query)
            .then(({ data, ...pagination }) => {
                setState({ 
                    items: data,
                    loading: false, 
                    error: null,
                    ...pagination,
                });
            })
            .catch((e) => {
                setState({ items: null, loading: false, error: e });
            });
    }, [LeModel, query]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
}


