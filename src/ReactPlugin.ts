import { AppFacade, Plugin, route } from "@luminix/core";

import FormsFacade from "./facades/FormsFacade";
import Text from "./components/Form/Input/Text";
import Select from "./components/Form/Input/Select";
import Radio from "./components/Form/Input/Radio";
import Checkbox from "./components/Form/Input/Checkbox";
import Textarea from "./components/Form/Input/Textarea";



class ReactPlugin extends Plugin {

    name = 'Luminix React Plugin';

    app?: AppFacade;

    register(app: AppFacade): void {
        this.app = app;
        app.bind('forms', new FormsFacade());
    }

    boot(): void {

        this.registerUrlParamReplacementForReactRouter();
        this.registerInputComponents();

    }

    private registerUrlParamReplacementForReactRouter() {
        route().reducer('replaceRouteParams', (prevUrl: string) => {
            // remove leading and trailing slashes
            const url = prevUrl.replace(/^\/+|\/+$/g, '');
            const regex = /{([^}]+)}/g;

            return `/${url.replace(regex, ':$1')}`;
        });
    }

    private registerInputComponents() {
        this.app!.make('forms').reducer('replaceFormInputComponent', (_: React.Component, type: string) => {
            
            if (type === 'select') {
                return Select;
            }

            if (type === 'radio') {
                return Radio;
            }

            if (type === 'checkbox') {
                return Checkbox;
            }

            if (type === 'textarea') {
                return Textarea;
            }

            return Text;
        }, 0);
    }
}

export default ReactPlugin;