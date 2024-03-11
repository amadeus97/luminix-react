import React from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { RouteGenerator } from '@luminix/core/dist/types/Route';
import { app, isValidationError, route } from '@luminix/core';

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

const useApiRequest = <T = unknown>(options: UseApiRequestOptions) => {
    const {
        url,
        params,
        route: routeGenerator,
        ...axiosOptions
    } = options;

    const [state, setState] = React.useState<ApiRequestState<T>>({
        response: null,
        error: null,
        loading: false,
    });

    const urlWithParams = (routeGenerator ? route().url(routeGenerator) : url) 
        + (params ? `?${searchParamsFromObject(params).toString()}` : '');

    const method = axiosOptions.method ?? (routeGenerator
        ? route().methods(routeGenerator)[0]
        : 'get');

    const refresh = React.useCallback(() => {
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
                if (isValidationError(error)) {
                    const { errors } = error.response.data;
                    app('error').set(Object.entries(errors).reduce((acc, [key, value]) => {
                        acc[key] = value.join(' ');
                        return acc;
                    }, {} as Record<string,string>));
                }
                setState({ response: null, error, loading: false });
            }
        })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlWithParams, method]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state, refresh,
    };
};

export default useApiRequest;