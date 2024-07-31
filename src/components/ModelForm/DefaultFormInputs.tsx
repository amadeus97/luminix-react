
import React from 'react';

import useModelFormItem from '../../hooks/useModelFormItem';
import { collect, model } from '@luminix/core';
import Input from '../Form/Input';
import _ from 'lodash';


const DefaultFormInputs: React.FC = () => {

    const item = useModelFormItem();
    const modelType = item.getType();

    const attributes = React.useMemo(() => collect(model(modelType).getSchema().attributes), [modelType]);

    return item.fillable.map((key) => {
        const attribute = attributes.where('name', key).first();

        if (!attribute) {
            return null;
        }

        if (attribute.cast) {

            const castTypeMap: Record<string, string> = {
                date: 'date',
                datetime: 'datetime-local',
                hashed: 'password',
                int: 'number',
                float: 'number',
                boolean: 'checkbox',
            };

            return (
                <Input 
                    name={key}
                    type={castTypeMap[attribute.cast] ?? 'text'}
                    label={_.upperFirst(key)}
                />
            );
        }

        if (attribute.type) {

            const typeMap: Record<string, string> = {
                string: 'text',
                boolean: 'checkbox',
                int: 'number',
                float: 'number',
                date: 'date',
                datetime: 'datetime-local',
                hashed: 'password',
            };

            return (
                <Input
                    name={key}
                    type={typeMap[attribute.type] ?? 'text'}
                    label={_.upperFirst(key)}
                />
            );
        }


        return (
            <Input
                name={key}
                type="text"
                label={_.upperFirst(key)}
            />
        );

    });
};



export default DefaultFormInputs;
