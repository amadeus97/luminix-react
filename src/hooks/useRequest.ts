import { isValidationError, Query, RequestOptions, Response } from '@luminix/support';
import {
    App, Error as ErrorFacade, Http, HttpMethod, Log, Route, RouteGenerator,
} from '@luminix/core';

import React from 'react';


type ApiRequestState<T> = {
    response: T | null;
    error: unknown;
    loading: boolean;
};

type HttpRequestOptions = RequestOptions & {
    route?: RouteGenerator;
    url?: string;
    method: HttpMethod;
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
const useRequest = <T = unknown>(options: HttpRequestOptions, errorBag = 'default') => {
    
    const [state, setState] = React.useState<ApiRequestState<T>>({
        response: null,
        error: null,
        loading: false,
    });
    
    const refresh = React.useCallback(() => {

        const {
            url,
            params,
            route: routeGenerator,
            method: _method,
            ...rest
        } = options;
        
        const urlWithParams = (routeGenerator ? Route.url(routeGenerator) : url) 
            + (params ? `?${Query.fromObject(params).toString()}` : '');
    
        const method = _method ?? (routeGenerator
            ? Route.methods(routeGenerator)[0]
            : 'get');

        (async () => {
            setState({ response: null, error: null, loading: true });
            try {

                const client = Http.getClient();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response: Response = await (client.withOptions(rest) as any)[method](urlWithParams);

                if (response.successful()) {
                    setState({ response: response.json(), error: null, loading: false });
                } else if (isValidationError(response)) {

                    const errors = response.json('errors');

                    ErrorFacade.set(Object.entries(errors).reduce((acc, [key, value]) => {
                        acc[key] = value.join(' ');
                        return acc;
                    }, {} as Record<string,string>), errorBag);

                    setState({ response: null, error: response, loading: false });
                } else {

                    if (response.has('message')) {
                        ErrorFacade.set(
                            Route.clientError({ http: response.json('message') }, {
                                response,
                                name: routeGenerator 
                                    ? (typeof routeGenerator === 'string' ? routeGenerator : routeGenerator[0])
                                    : undefined,
                                replace: routeGenerator && typeof routeGenerator !== 'string' ? routeGenerator[1] : undefined,
                                client,
                            }),
                            errorBag
                        );
                    }

                    response.throw();
                }

            } catch (error: unknown) {
                if (App.hasDebugModeEnabled()) {
                    Log.error(error);
                }

                setState({ response: null, error, loading: false });
            }
        })();

    }, [errorBag, options]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state, refresh,
    };
};

export default useRequest;