import React from 'react';
import axios, { AxiosRequestConfig } from 'axios';

type ApiRequestState<T> = {
    response: T | null;
    error: unknown;
    loading: boolean;
};

const useApiRequest = <T = unknown>(options: AxiosRequestConfig) => {
    const {
        url,
        method = 'GET',
        ...axiosOptions
    } = options;

    const [state, setState] = React.useState<ApiRequestState<T>>({
        response: null,
        error: null,
        loading: false,
    });

    const refresh = React.useCallback(() => {
        (async () => {
            setState({ response: null, error: null, loading: true });
            try {
                const response = await axios({
                    method,
                    url,
                    ...axiosOptions,
                });

                setState({ response: response.data, error: null, loading: false });
            } catch (error: unknown) {
                setState({ response: null, error, loading: false });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, method]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state, refresh,
    };
};

export default useApiRequest;