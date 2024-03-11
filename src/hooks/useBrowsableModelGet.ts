import { Model } from '@luminix/core';
import useModelGet from './useModelGet';
import { useSearchParams } from 'react-router-dom';
import React from 'react';

const reflectSearchParams = ['page', 'per_page', 'q', 'order_by', 'filters', 'tab'];

export default function useBrowsableModelGet(abstract: string | typeof Model) {

    const [searchParams] = useSearchParams();

    const query = React.useMemo(() => {
        const obj = Object.fromEntries(searchParams);
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (reflectSearchParams.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, unknown>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return useModelGet(abstract, query);
    
}

