import { HasFacadeAccessor, MakeFacade, ReducibleInterface } from '@luminix/support';
import { App } from '@luminix/core';

import { FormServiceBase, FormServicesReducers } from '../types/Form';

class FormsFacade implements HasFacadeAccessor {

    getFacadeAccessor(): string | object {
        return 'forms';
    }

}

const Forms = MakeFacade<
    FormServiceBase & FormServicesReducers & ReducibleInterface<FormServicesReducers>,
    FormsFacade
>(FormsFacade, App);

export default Forms;
