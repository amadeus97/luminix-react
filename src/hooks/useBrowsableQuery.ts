import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { BuilderInterface } from '@luminix/core/dist/types/Builder';

import useQuery from './useQuery';


export default function useBrowsableQuery(query: BuilderInterface) {

    const [searchParams] = useSearchParams();

    const location = useLocation();

    const page = searchParams.has('page') ? Number(searchParams.get('page')) : 1;
    
    React.useEffect(() => {        
        // check if key matches pattern filters[*]
        const extractFilter = (str: string) => {
            const matches = str.match(/^filters\[(.*)\]$/);
            return matches ? matches[1] : null;
        };

        for (const [key, value] of searchParams.entries()) {

            const content = extractFilter(key);
        
            if (content) {
                query.where(content, value as string);
            } else if (key === 'order_by') {
                const [column, direction] = (value as string).split(':');
                query.orderBy(column, direction as 'asc' | 'desc');
            } else if (key === 'q') {
                query.searchBy(value);
            } else if (key === 'minified' && value) {
                query.minified();
            } else if (key === 'per_page') {
                query.limit(Number(value));
            }

        }

        return () => {
            
            for (const key of searchParams.keys()) {
                const content = extractFilter(key);
                if (content) {
                    query.unset(`filters.${content}`)
                } else if (['order_by', 'q', 'minified', 'per_page'].includes(key)) {
                    query.unset(key);
                }
            }
        }
    }, [searchParams, query]);

    const replaceLinksWith = React.useMemo(() => {
        return `${location.pathname}?${searchParams.toString()}`;
    }, [location.pathname, searchParams]);

    return useQuery(query, page, replaceLinksWith);

}

