import React from 'react';

import { BuilderInterface } from '@luminix/core/dist/types/Builder';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';

type UseQueryState = Partial<ModelPaginatedResponse> & {
    loading: boolean;
    error: Error | null;
};

/**
 * Hook to fetch list of models.
 * 
 */
export default function useQuery(query: BuilderInterface, page = 1, perPage = 15, replaceLinksWith?: string) {

    const [state, setState] = React.useState<UseQueryState>({
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState({ loading: true, error: null });
        query.get(page, perPage, replaceLinksWith)
            .then((response) => {
                setState({
                    loading: false, 
                    error: null,
                    ...response,
                });
            })
            .catch((error) => {
                setState({
                    loading: false,
                    error,
                });
            });
    }, [query, page, perPage, replaceLinksWith]);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        ...state,
        refresh,
    };
}

