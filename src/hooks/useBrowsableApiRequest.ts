import React from 'react';
import { AxiosRequestConfig } from 'axios';
import { useSearchParams } from 'react-router-dom';
import useApiRequest from './useApiRequest';
import { RouteGenerator } from '@luminix/core/dist/types/Route';

type UseQueryableApiRequestOptions = AxiosRequestConfig & {
    route?: RouteGenerator;
    reflectSearchParams?: string[];
};

export default function useBrowsableApiRequest(options: UseQueryableApiRequestOptions) {

    const {
        reflectSearchParams = [],
        ...axiosOptions
    } = options;

    const [searchParams] = useSearchParams();

    const params = React.useMemo(() => {
        const newParams = {} as Record<string, string>;
        reflectSearchParams.forEach((key) => {
            if (searchParams.has(key)) {
                newParams[key] = searchParams.get(key) as string;
            }
        });
        return newParams;
    }, [searchParams, reflectSearchParams]);

    return useApiRequest({
        ...axiosOptions,
        params,
    });

}

