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

/**
 * Hook to fetch list of models.
 * **WARNING** The request will be made on mount and on every change of the query.
 * If `query` should be a constant, declare it outside the component.
 * If `query` should be mutable, use `React.useMemo` or pass a state value as `query`.
 * 
 * Usage:
 * ```tsx
 * import { useModelGet } from '@luminix/react';
 * 
 * const MODEL_GET_QUERY = {
 *     page: 1,
 *     per_page: 30,
 *     q: 'search query',
 * };
 * 
 * const Component = () => {
 *    const { response, error, loading, refresh } = useModelGet('user', MODEL_GET_QUERY);
 * };
 * 
 * const ComponentWithMutableQuery = () => {
 *   const [query, setQuery] = React.useState(MODEL_GET_QUERY);
 *   const { response, error, loading, refresh } = useModelGet('user', query);
 *   // request will be made on mount and on every `setQuery` call
 * };
 * ```
 */
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


