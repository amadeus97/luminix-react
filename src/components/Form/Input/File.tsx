
import React from 'react';

import { InputProps } from '../../../types/Form';
import useCurrentForm from '../../../hooks/useCurrentForm';

import Text from './Text';

const File: React.FC<InputProps<'file'>> = (props) => {

    const { subscribe } = useCurrentForm();

    React.useEffect(() => {
        return subscribe((client) => client.asForm());
    }, [subscribe]);

    return (
        <Text {...props} />
    );
};


export default File;