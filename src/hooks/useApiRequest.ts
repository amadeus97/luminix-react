import React from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { RouteGenerator } from '@luminix/core/dist/types/Route';
import { app, isValidationError, log, route } from '@luminix/core';
import useConfig from './useConfig';

type ApiRequestState<T> = {
    response: T | null;
    error: unknown;
    loading: boolean;
};

type UseApiRequestOptions = AxiosRequestConfig & {
    route?: RouteGenerator;
};

const searchParamsFromObject = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value);
    });
    return searchParams;
};

/**
 * Custom hook to make an API request.
 * **WARNING** The request will be made on mount and on every change of the options.
 * If `options` should be a constant, declare it outside the component.
 * If `options` should be mutable, use `React.useMemo` or pass a state value as `options`.
 * 
 * The options extends `AxiosRequestConfig` and adds a `route` property to use the 
 * `@luminix/core` route facade.
 * 
 * ```tsx
 * import { useApiRequest } from '@luminix/react';
 * 
 * const API_REQUEST_OPTIONS = {
 *    route: 'luminix.user.index',
 *    params: { per_page: 30 },
 * };
 * 
 * const Component = () => {
 *    const { response, error, loading, refresh } = useApiRequest(API_REQUEST_OPTIONS);
 * }
 * 
 * const ComponentWithMutableOptions = () => {
 *   const [options, setOptions] = React.useState(API_REQUEST_OPTIONS);
 *   const { response, error, loading, refresh } = useApiRequest(options);
 *   // request will be made on mount and on every `setOptions` call
 * }
 * ```
 */
const useApiRequest = <T = unknown>(options: UseApiRequestOptions) => {
    
    const [state, setState] = React.useState<ApiRequestState<T>>({
        response: null,
        error: null,
        loading: false,
    });

    const debugMode = useConfig('app.debug', false);
    
    const refresh = React.useCallback(() => {

        const {
            url,
            params,
            route: routeGenerator,
            ...axiosOptions
        } = options;
        
        const urlWithParams = (routeGenerator ? route().url(routeGenerator) : url) 
            + (params ? `?${searchParamsFromObject(params).toString()}` : '');
    
        const method = axiosOptions.method ?? (routeGenerator
            ? route().methods(routeGenerator)[0]
            : 'get');

        (async () => {
            setState({ response: null, error: null, loading: true });
            try {
                const response = await axios({
                    url: urlWithParams,
                    method,
                    ...axiosOptions,
                });

                setState({ response: response.data, error: null, loading: false });
            } catch (error: unknown) {
                if (debugMode) {
                    log().error(error);
                }

                if (isValidationError(error)) {
                    const { errors } = error.response.data;
                    app('error').set(Object.entries(errors).reduce((acc, [key, value]) => {
                        acc[key] = value.join(' ');
                        return acc;
                    }, {} as Record<string,string>));
                } else if (axios.isAxiosError(error)) {
                    const axiosErrorReducer = route().axiosError;
                    if (typeof axiosErrorReducer !== 'function') {
                        throw new Error('Expect Route to be reducible.');
                    }
                    app('error').set(
                        axiosErrorReducer({ axios: error.message }, {
                            error, 
                            name: routeGenerator 
                                ? (typeof routeGenerator === 'string' ? routeGenerator : routeGenerator[0] )
                                : null, 
                            replace: routeGenerator 
                                ? (typeof routeGenerator === 'string' ? null : routeGenerator[1])
                                : null,
                            config: {
                                url: urlWithParams,
                                method,
                                ...axiosOptions,
                            }
                        })
                    );
                }
                setState({ response: null, error, loading: false });
            }
        })();

    }, [options, debugMode]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state, refresh,
    };
};

export default useApiRequest;