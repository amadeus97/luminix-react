import React from 'react';
import { Model } from '@luminix/core';
import { LuminixContext } from '../components/LuminixProvider';


function useModel(abstract: string): typeof Model
function useModel(abstract: string[]): (typeof Model)[]
function useModel(abstract: string | string[]): typeof Model | (typeof Model)[] {
    const { models } = React.useContext(LuminixContext);
    
    return React.useMemo(() => {
        if (Array.isArray(abstract)) {
            if (!abstract.every((name) => name in models)) {
                const notFound = abstract.filter((a) => !(a in models)).join(', ');
                throw new Error(`Model ${notFound} not found in the LuminixProvider.`);
            }
            return abstract.map((name) => models[name]);
        }

        if (!(abstract in models)) {
            throw new Error(`Model ${abstract} not found in the LuminixProvider.`);
        }
    
        return models[abstract];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, Array.isArray(abstract) ? [models, ...abstract] : [models, abstract]);
}

export default useModel;
