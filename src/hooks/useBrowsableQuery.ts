import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { BuilderInterface } from '@luminix/core/dist/types/Builder';

import useQuery from './useQuery';


export default function useBrowsableQuery(query: BuilderInterface) {

    const [searchParams] = useSearchParams();

    const location = useLocation();

    const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
    const perPage = searchParams.has('per_page') ? Number(searchParams.get('per_page')) : 15;
    
    React.useEffect(() => {        
        // check if key matches pattern filters[*]
        const extractContent = (str: string) => {
            const matches = str.match(/^filters\[(.*)\]$/);
            return matches ? matches[1] : null;
        };

        for (const [key, value] of searchParams.entries()) {

            const content = extractContent(key);
        
            if (content) {
                query.where(content, value as string);
            } else if (key === 'order_by') {
                const [column, direction] = (value as string).split(':');
                query.orderBy(column, direction as 'asc' | 'desc');
            } else if (key === 'q') {
                query.searchBy(value);
            } else if (key === 'minified' && value) {
                query.minified();
            }

        }

        return () => {
            
            for (const key of searchParams.keys()) {
                const content = extractContent(key);
                if (content) {
                    query.unset(`filters.${content}`)
                } else if (['order_by', 'q', 'minified'].includes(key)) {
                    query.unset(key);
                }
            }
        }
    }, [searchParams, query]);

    const replaceLinksWith = React.useMemo(() => {
        return `${location.pathname}?${searchParams.toString()}`;
    }, [location.pathname, searchParams]);

    return useQuery(query, page, perPage, replaceLinksWith);

}

