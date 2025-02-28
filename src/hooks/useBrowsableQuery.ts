import React from 'react';
import { BuilderInterface, ModelType as Model, ModelPaginatedResponse } from '@luminix/core';

import { useSearchParams } from 'react-router-dom';

import useQuery from './useQuery';


type Builder = BuilderInterface<Model, ModelPaginatedResponse>;


export default function useBrowsableQuery(queryFactory: () => Builder) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = React.useState<Builder|null>(null);

    const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
    
    React.useEffect(() => {
        setQuery(
            queryFactory().include(searchParams)
        );

        return () => {
            setQuery(null);
        };
    }, [searchParams, queryFactory]);

    const queryResults = useQuery(query, { page });

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

