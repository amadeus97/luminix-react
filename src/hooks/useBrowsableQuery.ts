import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { BuilderInterface as Builder } from '@luminix/core/dist/types/Builder';

import useQuery from './useQuery';

import { Model, ModelPaginatedResponse } from '@luminix/core/dist/types/Model';

type BuilderInterface = Builder<Model, ModelPaginatedResponse>;


export default function useBrowsableQuery(queryFactory: () => BuilderInterface) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = React.useState<BuilderInterface|null>(null);

    const location = useLocation();

    const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
    
    React.useEffect(() => {
        setQuery(
            queryFactory().include(searchParams)
        );
    }, [searchParams, queryFactory]);

    const replaceLinksWith = React.useMemo(() => {
        return `${location.pathname}?${searchParams.toString()}`;
    }, [location.pathname, searchParams]);

    const queryResults = useQuery(query, page, { replaceLinksWith });

    // redirect to last page if current page is higher than last page
    const {
        meta: { current_page: currentPage, last_page: lastPage } = {},
    } = queryResults;

    React.useEffect(() => {
        if (currentPage && lastPage && currentPage > lastPage) {
            setSearchParams((params) => {
                params.set('page', lastPage.toString());
                return params;
            }, { replace: true });
        }
    }, [currentPage, lastPage, setSearchParams]);

    return queryResults;

}

