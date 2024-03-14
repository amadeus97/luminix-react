import React from "react";
import { Model, config, log, model } from "@luminix/core";

type ModelFindState = {
    item: Model | null;
    loading: boolean;
    error: Error | null;
};

/**
 * Hook to find a model by its id.
 * 
 * Usage:
 * ```tsx
 * import { useModelFind } from '@luminix/react';
 * 
 * const {
 *   item, loading, error, refresh
 * } = useModelFind('user', 1);
 * ```
 */
export default function useModelFind(abstract: string | typeof Model, id: string | number) {
    const LeModel = React.useMemo(() => typeof abstract === 'string' 
        ? model(abstract) 
        : abstract, [abstract]);

    const [state, setState] = React.useState<ModelFindState>({
        item: null,
        loading: true,
        error: null,
    });

    const refresh = React.useCallback(() => {
        setState({ loading: true, error: null, item: null });
        LeModel.find(id)
            .then((i) => {
                setState({ item: i, loading: false, error: null });
            })
            .catch((e) => {
                if (config('app.debug')) {
                    log().error(e);
                }
                setState({ item: null, loading: false, error: e });
            });
    }, [id, LeModel]);

    React.useEffect(refresh, [refresh]);

    return {
        ...state,
        refresh,
    };
    
}
