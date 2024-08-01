
import React from 'react';

import useModelFormItem from '../../hooks/useModelFormItem';
import { app } from '@luminix/core';
import Input from '../Form/Input';


import { InputProps } from '../../types/Form';


function DefaultFormInputs(): React.ReactNode {

    const item = useModelFormItem();

    return React.useMemo(() => {

        const inputProps = app('forms').getDefaultInputsForModel(item);

        return inputProps.map((props: InputProps<string> | null) => props && <Input key={props.name} {...props} />);
    }, [item]);

}

export default DefaultFormInputs;
