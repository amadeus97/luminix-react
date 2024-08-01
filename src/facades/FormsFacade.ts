import { collect, model, Model, Reducible } from "@luminix/core";
import { ReducerCallback } from "@luminix/core/dist/types/Reducer";
import _ from "lodash";

class FormsFacade {


    getUseFormProps(data: object) {
        return {
            ...data,
            ...this.expandUseFormProps({}, data),
        }
    }

    getFormInputComponent(type: string): React.Component {
        return this.replaceFormInputComponent('input', type);
    }

    getDefaultInputsForModel(item: Model) {
        const modelType = item.getType();
        const attributes = collect(model(modelType).getSchema().attributes);

        const basePropsArray = item.fillable.map((key) => {
            const attribute = attributes.where('name', key).first();

            if (!attribute) {
                return null;
            }

            const castTypeMap: Record<string, string> = this.mapAttributeCastToInputTypes({
                date: 'date',
                datetime: 'datetime-local',
                hashed: 'password',
                int: 'number',
                float: 'number',
                boolean: 'checkbox',
            }, item, attribute);

            if (attribute.cast && attribute.cast in castTypeMap) {
                return {
                    name: key,
                    type: castTypeMap[attribute.cast] ?? 'text',
                    label: _.upperFirst(key),
                };
            }

            const typeMap: Record<string, string> = this.mapAttributeTypeToInputTypes({
                string: 'text',
                boolean: 'checkbox',
                int: 'number',
                float: 'number',
                date: 'date',
                datetime: 'datetime-local',
                hashed: 'password',
            }, item, attribute);

            if (attribute.type && attribute.type in typeMap) {
                return {
                    name: key,
                    type: typeMap[attribute.type] ?? 'text',
                    label: _.upperFirst(key),
                };
            }

            return {
                name: key,
                type: 'text',
                label: _.upperFirst(key),
            };
        });

        return this[`selectDefaultInputsFor${_.upperFirst(_.camelCase(item.getType()))}`](basePropsArray, item);
    }

    [reducer: string]: ReducerCallback;

}

export default Reducible(FormsFacade);
