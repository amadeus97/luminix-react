import { Model, config, log, model } from '@luminix/core';
import { ModelGetOptions, ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import React from 'react';

type ModelGetState = Partial<ModelPaginatedResponse> & {
    loading: boolean;
    error: Error | null;
};


/**
 * Hook to fetch list of models.
 * **WARNING** The request will be made on mount and on every change of the options.
 * If `options` should be a constant, declare it outside the component.
 * If `options` should be mutable, use `React.useMemo` or pass a state value as `options`.
 * 
 * Usage:
 * ```tsx
 * import { useModelGet } from '@luminix/react';
 * 
 * const MODEL_GET_OPTIONS = {
 *     query: {
 *         page: 1,
 *         per_page: 30,
 *         q: 'search query',
 *     }
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
export default function useModelGet(abstract: string | typeof Model, options: ModelGetOptions = {}) {

    const LeModel = React.useMemo(() => typeof abstract === 'string' 
        ? model(abstract) 
        : abstract, [abstract]);

    const [state, setState] = React.useState<ModelGetState>({
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState({ loading: true, error: null });
        LeModel.get(options)
            .then((response) => {
                console.log(response);
                setState({
                    loading: false, 
                    error: null,
                    ...response,
                });
            })
            .catch((e) => {
                if (config('app.debug')) {
                    log().error(e);
                }
                setState({ loading: false, error: e });
            });
    }, [LeModel, options]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
}


