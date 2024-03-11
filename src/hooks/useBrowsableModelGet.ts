import { Model } from '@luminix/core';
import useModelGet from './useModelGet';
import { useSearchParams } from 'react-router-dom';
import React from 'react';

const REFLECT_SEARCH_PARAMS = ['page', 'per_page', 'q', 'order_by', 'filters', 'tab'];

const DEFAULT_ADDED_SEARCH_PARAMS: string[] = []

export default function useBrowsableModelGet(abstract: string | typeof Model, addedSearchParams = DEFAULT_ADDED_SEARCH_PARAMS) {

    const [searchParams] = useSearchParams();

    const query = React.useMemo(() => {
        const obj = Object.fromEntries(searchParams);
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (REFLECT_SEARCH_PARAMS.includes(key) || addedSearchParams.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, unknown>);
    }, [addedSearchParams, searchParams]);

    return useModelGet(abstract, query);
    
}

