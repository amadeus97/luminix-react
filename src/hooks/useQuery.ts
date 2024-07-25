import React from 'react';

import { BuilderInterface as Builder } from '@luminix/core/dist/types/Builder';
import { Model, ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import { log } from '@luminix/core';
//import _ from 'lodash';

type BuilderInterface = Builder<Model, ModelPaginatedResponse>;

type UseQueryState = Partial<ModelPaginatedResponse> & {
    loading: boolean;
    error: Error | null;
};

export type UseQueryOptions = {
    replaceLinksWith?: string;
    //throttle?: number;
};

/**
 * 
 * Hook to fetch list of models.
 * 
 */
export default function useQuery(query: BuilderInterface|null, page = 1, options: UseQueryOptions = {}) {

    const {
        replaceLinksWith, //throttle = 0,
    } = options;

    const [state, setState] = React.useState<UseQueryState>({
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {

        setState(({ meta, links }) => ({
            loading: true,
            error: null,
            meta,
            links,
        }));

        if (!query) {
            return;
        }

        query.get(page, replaceLinksWith)
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
                log().error(error);
            });
    }, [query, page, replaceLinksWith]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
}

