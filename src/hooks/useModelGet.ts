import React from 'react';
import { log } from '@luminix/core';
import { ModelGetOptions, ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import useModel from './useModel';
import useConfig from './useConfig';

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
export default function useModelGet(abstract: string, options: ModelGetOptions = {}) {

    const Model = useModel(abstract);
    const debugMode = useConfig('app.debug', false);

    const [state, setState] = React.useState<ModelGetState>({
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState({ loading: true, error: null });
        Model.get(options)
            .then((response) => {
                setState({
                    loading: false, 
                    error: null,
                    ...response,
                });
            })
            .catch((e) => {
                if (debugMode) {
                    log().error(e);
                }
                setState({ loading: false, error: e });
            });
    }, [Model, options, debugMode]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
}


