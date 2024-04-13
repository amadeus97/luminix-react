import React from 'react';

import { BuilderInterface as Builder } from '@luminix/core/dist/types/Builder';
import { Model, ModelPaginatedResponse } from '@luminix/core/dist/types/Model';
import { log } from '@luminix/core';
import _ from 'lodash';

type BuilderInterface = Builder<Model, ModelPaginatedResponse>;

type UseQueryState = Partial<ModelPaginatedResponse> & {
    loading: boolean;
    error: Error | null;
};

export type UseQueryOptions = {
    replaceLinksWith?: string;
    throttle?: number;
};

/**
 * 
 * Hook to fetch list of models.
 * 
 */
export default function useQuery(query: BuilderInterface, page = 1, options: UseQueryOptions = {}) {

    const {
        replaceLinksWith, throttle = 0,
    } = options;

    const [state, setState] = React.useState<UseQueryState>({
        loading: true,
        error: null,
    });

    const refresh = (query: BuilderInterface, page: number, replaceLinksWith?: string) => {
        setState(({ meta, links }) => ({
            loading: true,
            error: null,
            meta,
            links,
        }));
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
    };

    const refreshRef = React.useRef(_.throttle(refresh, throttle));

    React.useEffect(() => {
        refreshRef.current(query, page, replaceLinksWith);
    }, [query, page, replaceLinksWith]);

    return {
        ...state,
        refresh: () => refresh(query, page, replaceLinksWith),
    };
}

