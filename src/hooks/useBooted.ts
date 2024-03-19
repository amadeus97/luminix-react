import React from 'react';

import { LuminixContext } from '../providers/LuminixProvider';


export default function useBooted() {
    const { booted } = React.useContext(LuminixContext);

    return booted;
}

