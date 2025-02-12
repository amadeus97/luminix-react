import { ServiceProvider } from '@luminix/support';
import { Route } from "@luminix/core";

import { FormServiceInterface } from './types/Form';
import FormService from './services/FormService';

declare module '@luminix/core' {

    interface AppContainers {
        forms: FormServiceInterface;
    }

}

class ReactServiceProvider extends ServiceProvider {

    [Symbol.toStringTag] = 'ReactServiceProvider';

    register(): void {
        this.app.singleton('forms', () => new FormService());
    }

    boot(): void {

        this.registerUrlParamReplacementForReactRouter();
    }

    private registerUrlParamReplacementForReactRouter() {
        Route.reducer('replaceRouteParams', (prevUrl) => {
            // remove leading and trailing slashes
            const url = prevUrl.replace(/^\/+|\/+$/g, '');
            const regex = /{([^}]+)}/g;

            return `/${url.replace(regex, ':$1')}`;
        });
    }




}

export default ReactServiceProvider;