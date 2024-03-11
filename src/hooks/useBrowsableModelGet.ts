import { Model } from '@luminix/core';
import useModelGet from './useModelGet';
import { useSearchParams } from 'react-router-dom';
import React from 'react';

const REFLECT_SEARCH_PARAMS = ['page', 'per_page', 'q', 'order_by', 'filters', 'tab'];

const DEFAULT_ADDED_SEARCH_PARAMS: string[] = []

/**
 * Extends `useModelGet` to reflect the current browser search params in the request.
 * **WARNING** The request will be made on mount, when the abstract changes, when
 * the searchParams is changed and when the addedSearchParams is changed.
 * If `addedSearchParams` should be a constant, declare it outside the component.
 * If `addedSearchParams` should be mutable, use `React.useMemo` or pass a state value as `addedSearchParams`.
 * 
 * The `abstract` can be a string or a `Model` class, which is a known immutable reference,
 * so it's safe to use it as a dependency.
 * 
 * The `addedSearchParams` is a list of search params to reflect in the request, in addition
 * to the default search params: `page`, `per_page`, `q`, `order_by`, `filters` and `tab`.
 * 
 * ```tsx
 * import { useBrowsableModelGet } from '@luminix/react';
 * 
 * const ADDED_SEARCH_PARAMS = ['with'];
 * 
 * const Component = () => {
 *    const { response, error, loading, refresh } = useBrowsableModelGet('user', ADDED_SEARCH_PARAMS);
 * };
 */
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

