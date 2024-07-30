import { Reducible } from "@luminix/core";
import { ReducerCallback } from "@luminix/core/dist/types/Reducer";

class FormsFacade {


    getUseFormProps(data: object) {
        return {
            ...data,
            ...this.getUseFormExpandedProps({}, data),
        }
    }

    [reducer: string]: ReducerCallback

}

export default Reducible(FormsFacade);
