import React from 'react';

import { BuilderInterface } from '@luminix/core/dist/types/Builder';
import { Model } from '@luminix/core/dist/types/Model';
import { Collection } from '@luminix/core/dist/contracts/Collection';

type UseQueryAllState = {
    data: Collection<Model> | null;
    loading: boolean;
    error: Error | null;
};

/**
 * Hook to fetch list of models.
 * 
 */
export default function useQueryAll(query: BuilderInterface) {

    const [state, setState] = React.useState<UseQueryAllState>({
        data: null,
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState((data) => ({
            ...data,
            loading: true,
            error: null,
        }));
        query.all()
            .then((response) => {
                setState({
                    loading: false, 
                    error: null,
                    data: response,
                });
            })
            .catch((error) => {
                setState({
                    loading: false,
                    error,
                    data: null,
                });
            });
    }, [query]);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        ...state,
        refresh,
    };
}

