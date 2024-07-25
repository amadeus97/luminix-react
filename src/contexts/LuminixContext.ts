import { Router } from '@remix-run/router';
import React from 'react';


export type LuminixContextState = {
    booted: boolean,
    router: Router | null,

};

export const luminixInitialState: LuminixContextState = {
    booted: false,
    router: null,
};


const LuminixContext = React.createContext<LuminixContextState>(luminixInitialState);

export default LuminixContext;