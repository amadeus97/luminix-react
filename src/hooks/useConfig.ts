import React from "react";
import LuminixContext from "../contexts/LuminixContext";
import _ from "lodash";


function useConfig(path: string, defaultValue?: unknown): unknown
function useConfig(path: string[], defaultValue?: unknown): unknown[]
function useConfig(path: string | string[], defaultValue: unknown = null): unknown {
    const { config } = React.useContext(LuminixContext);

    return React.useMemo(() => {
        if (Array.isArray(path)) {
            return path.reduce((acc, key) => {
                if (_.has(config, key)) {
                    return [
                        ...acc,
                        _.get(config, key)
                    ];
                }
                return [
                    ...acc,
                    defaultValue
                ];
            }, [] as unknown[]);
        }
    
        if (_.has(config, path)) {
            return _.get(config, path);
        }
    
        return defaultValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config]);
}

export default useConfig;
