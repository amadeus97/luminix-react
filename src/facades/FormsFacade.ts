import { Reducible } from "@luminix/core";
import { ReducerCallback } from "@luminix/core/dist/types/Reducer";

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

    [reducer: string]: ReducerCallback;

}

export default Reducible(FormsFacade);
