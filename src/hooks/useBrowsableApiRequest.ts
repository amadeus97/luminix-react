import React from 'react';
import { AxiosRequestConfig } from 'axios';
import { useSearchParams } from 'react-router-dom';
import useApiRequest from './useApiRequest';
import { RouteGenerator } from '@luminix/core/dist/types/Route';

type UseQueryableApiRequestOptions = AxiosRequestConfig & {
    route?: RouteGenerator;
    reflectSearchParams?: string[];
};

/**
 * Extends `useApiRequest` to reflect the current browser search params in the request.
 * **WARNING** The request will be made on mount and on every change of the options.
 * If `options` should be a constant, declare it outside the component.
 * If `options` should be mutable, use `React.useMemo` or pass a state value as `options`.
 * 
 * The options extends `AxiosRequestConfig` and adds the properties:
 *  - `route`: property to use the `@luminix/core` route facade.
 *  - `reflectSearchParams`: list of search params to reflect in the request.
 * 
 * ```tsx
 * import { useBrowsableApiRequest } from '@luminix/react';
 * 
 * const API_REQUEST_OPTIONS = {
 *   route: 'luminix.user.index',
 *   reflectSearchParams: ['page', 'per_page'],
 * };
 * 
 * const Component = () => {
 *   const { response, error, loading, refresh } = useBrowsableApiRequest(API_REQUEST_OPTIONS);
 * }
 * 
 * const ComponentWithMutableOptions = () => {
 *   const [options, setOptions] = React.useState(API_REQUEST_OPTIONS);
 *   const { response, error, loading, refresh } = useBrowsableApiRequest(options);
 *  // request will be made on mount and on every `setOptions` call
 * }
 * ```
 */
export default function useBrowsableApiRequest(options: UseQueryableApiRequestOptions) {

    
    const [searchParams] = useSearchParams();
    
    const apiRequestOptions = React.useMemo(() => {

        const {
            reflectSearchParams = [],
            ...axiosOptions
        } = options;

        const newParams = {} as Record<string, string>;
        reflectSearchParams.forEach((key) => {
            if (searchParams.has(key)) {
                newParams[key] = searchParams.get(key) as string;
            }
        });
        return {
            ...axiosOptions,
            params: {
                ...axiosOptions.params,
                ...newParams,
            },
        };
        
    }, [searchParams, options]);

    return useApiRequest(apiRequestOptions);

}

