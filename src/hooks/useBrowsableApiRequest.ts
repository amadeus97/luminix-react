import React from 'react';
import { AxiosRequestConfig } from 'axios';
import { useSearchParams } from 'react-router-dom';
import useApiRequest from './useApiRequest';

type UseQueryableApiRequestOptions = AxiosRequestConfig & {
    reflectSearchParams?: string[];
};

export default function useBrowsableApiRequest(options: UseQueryableApiRequestOptions) {

    const {
        reflectSearchParams = [],
        url,
        method = 'get',
        ...axiosOptions
    } = options;

    const [searchParams] = useSearchParams();

    const query = React.useMemo(() => {
        const params = new URLSearchParams(searchParams);
        // ignoreSearchParams.forEach((key) => {
        //     params.delete(key);
        // });
        reflectSearchParams.forEach((key) => {
            const value = params.get(key);
            if (value) {
                params.set(key, value);
            }
        });
        return params.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return useApiRequest({
        url: `${url}?${query}`,
        method,
        ...axiosOptions,
    });

}

