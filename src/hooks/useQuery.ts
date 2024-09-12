import React from 'react';

import { Collection } from '@luminix/support';

import {
    BuilderInterface as Builder, ModelType as Model, ModelPaginatedResponse,
    collect, log,
} from '@luminix/core';

import match from '../support/match';
//import _ from 'lodash';

type BuilderInterface = Builder<Model, ModelPaginatedResponse>;

type UseQueryState = Partial<ModelPaginatedResponse> & {
    loading: boolean;
    error: Error | null;
};

export type UseQueryOptions = {
    replaceLinksWith?: string;
    method?: 'get' | 'first' | 'all' | 'find';
    page?: number;
    id?: number | string;
};

/**
 * 
 * Hook to fetch list of models.
 * 
 * 
 * 
 */
export default function useQuery(query: BuilderInterface|null, options: UseQueryOptions = {}) {

    const {
        replaceLinksWith, method = 'get', page = 1, id,
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

        const params = match(method, {
            get: () => [page, replaceLinksWith],
            all: () => [],
            first: () => [],
            find: () => [id],
        });

        if (!params) {
            log().error(`useQuery: method '${method}' is not supported`);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query[method](...params as [any, any])
            .then((response) => {
 
                const data = match(method, {
                    get: () => (response as ModelPaginatedResponse).data,
                    all: () => response as Collection<Model>,
                    first: () => response ? collect([response as Model]) : null,
                    find: () => response ? collect([response as Model]) : null,
                });

                setState({
                    loading: false, 
                    error: null,
                    data: data ?? undefined,
                    ...(method === 'get' ? response : undefined),
                });
            })
            .catch((error: Error) => {
                setState({
                    loading: false,
                    error,
                });
                log().error(error);
            });


    }, [query, page, replaceLinksWith, method, id]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
}

