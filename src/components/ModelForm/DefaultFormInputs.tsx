
import React from 'react';

import useModelFormItem from '../../hooks/useModelFormItem';
import Input from '../Form/Input';

import Forms from '../../facades/Forms';


function DefaultFormInputs({ confirmed = [] }: { confirmed?: string[] }): React.ReactNode {

    const item = useModelFormItem();

    return React.useMemo(() => {

        const inputProps = Forms.getDefaultInputsForModel(item, confirmed);

        return inputProps.map((props) => props && <Input key={props.name} {...props} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item, ...confirmed]);

}

export default DefaultFormInputs;
