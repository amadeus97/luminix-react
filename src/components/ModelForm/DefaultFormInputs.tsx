
import React from 'react';

import useModelFormItem from '../../hooks/useModelFormItem';
import { app } from '@luminix/core';
import Input from '../Form/Input';


import { InputProps } from '../../types/Form';


function DefaultFormInputs({ confirmed = [] }: { confirmed?: string[] }): React.ReactNode {

    const item = useModelFormItem();

    return React.useMemo(() => {

        const inputProps = app('forms').getDefaultInputsForModel(item, confirmed);

        return inputProps.map((props: InputProps<string> | null) => props && <Input key={props.name} {...props} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, ...confirmed]);

}

export default DefaultFormInputs;
