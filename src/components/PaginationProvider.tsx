import React from 'react';
import { ModelType as Model, BuilderInterface, ModelPaginatedResponse } from '@luminix/core';

import useBrowsableQuery from '../hooks/useBrowsableQuery';

import PaginationContext from '../contexts/PaginationContext';


export type PaginationProviderProps = {
    factory: () => BuilderInterface<Model, ModelPaginatedResponse>,
    children?: React.ReactNode,
};

const PaginationProvider: React.FunctionComponent<PaginationProviderProps> = ({
    factory, children,
}) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const results = useBrowsableQuery(factory);

    return (
        <PaginationContext.Provider
            value={results}
        >
            {children}
        </PaginationContext.Provider>
    );

};

export default PaginationProvider;