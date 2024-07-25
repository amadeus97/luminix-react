import React from 'react';

import useBrowsableQuery from '../hooks/useBrowsableQuery';

import QueryContext from '../contexts/QueryContext';
import { Model } from '@luminix/core';
import { Scope } from '@luminix/core/dist/types/Builder';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';

export type QueryProviderProps = {
    Model: typeof Model,
    scope?: Scope<Model, ModelPaginatedResponse>,
    dependencies?: unknown[],
    children?: React.ReactNode,
};

const QueryProvider: React.FunctionComponent<QueryProviderProps> = ({
    Model, children,
    scope = () => {},
    dependencies = [],
}) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const factory = React.useCallback(() => Model.where(scope), [Model, ...dependencies]);

    const results = useBrowsableQuery(factory);

    return (
        <QueryContext.Provider
            value={{
                Model,
                ...results,
            }}
        >
            {children}
        </QueryContext.Provider>
    );

};

export default QueryProvider;