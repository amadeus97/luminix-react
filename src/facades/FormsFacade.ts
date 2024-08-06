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

    getDefaultInputsForModel(item: Model, confirmed: string[] = []) {
        const modelType = item.getType();
        const attributes = collect(model(modelType).getSchema().attributes);

        const basePropsArray = item.fillable.flatMap((key) => {
            return this[`getDefaultInputProps`]({
                name: key,
            }, { attributes, confirmed, item });
        });

        return this[`selectDefaultInputsFor${_.upperFirst(_.camelCase(modelType))}`](basePropsArray, item);
    }

    [reducer: string]: ReducerCallback;

}

export default Reducible(FormsFacade);
