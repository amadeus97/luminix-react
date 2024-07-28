import { AppFacade, Plugin, route } from "@luminix/core";

import FormsFacade from "./facades/FormsFacade";



class ReactPlugin extends Plugin {

    name = 'Luminix React Plugin';

    register(app: AppFacade): void {
        app.bind('forms', new FormsFacade());
    }

    boot(): void {

        this.registerUrlParamReplacementForReactRouter();

    }

    private registerUrlParamReplacementForReactRouter() {
        route().reducer('replaceRouteParams', (prevUrl: string) => {
            // remove leading and trailing slashes
            const url = prevUrl.replace(/^\/+|\/+$/g, '');
            const regex = /{([^}]+)}/g;

            return `/${url.replace(regex, ':$1')}`;
        });
    }
}

export default ReactPlugin;