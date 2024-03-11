import { Model, model } from '@luminix/core';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import React from 'react';

type ModelGetState = Partial<ModelPaginatedResponse> & {
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
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState({ loading: true, error: null });
        LeModel.get(query)
            .then((response) => {
                setState({
                    loading: false, 
                    error: null,
                    ...response,
                });
            })
            .catch((e) => {
                setState({ loading: false, error: e });
            });
    }, [LeModel, query]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
}


