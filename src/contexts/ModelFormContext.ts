import { ModelType as Model } from '@luminix/core';
import React from 'react';

const ModelFormContext = React.createContext<{ item: Model }>({
    item: null as unknown as Model,
});

export default ModelFormContext;