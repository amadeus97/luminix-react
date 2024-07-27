import React from 'react';

import useBrowsableQuery from '../hooks/useBrowsableQuery';

import PaginationContext from '../contexts/PaginationContext';
import { Model } from '@luminix/core';
import { BuilderInterface } from '@luminix/core/dist/types/Builder';
import { ModelPaginatedResponse } from '@luminix/core/dist/types/Model';

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