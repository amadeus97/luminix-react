import { Model } from '@luminix/core';
import { AppConfiguration } from '@luminix/core/dist/types/Config';
import { Router } from '@remix-run/router';
import React from 'react';


export type LuminixContextState = {
    auth: {
        user: Model | null,
    },
    booted: boolean,
    config: AppConfiguration,
    models: Record<string, typeof Model>,
    router: Router | null,

};

export const luminixInitialState: LuminixContextState = {
    auth: {
        user: null,
    },
    booted: false,
    config: {},
    models: {},
    router: null,
};


const LuminixContext = React.createContext<LuminixContextState>(luminixInitialState);

export default LuminixContext;