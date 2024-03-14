import { Plugin, app } from "@luminix/core";
import { AppFacades } from "@luminix/core/dist/types/App";


export default class ReactPlugin extends Plugin {

    boot({ route }: AppFacades) {

        route.reducer('replaceRouteParams', (prevUrl: string) => {
            // remove leading and trailing slashes
            const url = prevUrl.replace(/^\/+|\/+$/g, '');

            const regex = /{([^}]+)}/g;

            return `/${url.replace(regex, ':$1')}`;
        });
    }

    static selfRegister() {
        app().on('init', ({ register }) => {
            register(new ReactPlugin());
        });
    }

}




