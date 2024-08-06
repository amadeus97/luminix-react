import { AppFacade, Plugin, route } from "@luminix/core";

import FormsFacade from "./facades/FormsFacade";
import Text from "./components/Form/Input/Text";
import Select from "./components/Form/Input/Select";
import Radio from "./components/Form/Input/Radio";
import Checkbox from "./components/Form/Input/Checkbox";
import Textarea from "./components/Form/Input/Textarea";
import DatetimeLocal from "./components/Form/Input/DatetimeLocal";
import { Model, ModelAttribute } from "@luminix/core/dist/types/Model";
//import _ from "lodash";
import { Collection } from "@luminix/core/dist/types/Collection";
import { textCase } from "./support/string";



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
        this.registerFormInputSelector();

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

            if (type === 'datetime-local') {
                return DatetimeLocal;
            }

            return Text;
        }, 0);
    }

    private registerFormInputSelector() {

        const forms = this.app!.make('forms');

        forms.reducer('getDefaultInputProps', (
            { name: key }: { name: string },
            { attributes, item, confirmed }: { attributes: Collection<ModelAttribute>, item: Model, confirmed: string[] }
        ) => {
            const baseProps = ((key) => {
                const attribute = attributes.where('name', key).first();

                const id = `luminix-form-${item.getType()}-${item.getKey() || 'new'}-${key}`;
    
                if (!attribute) {
                    return null;
                }
    
                const castTypeMap: Record<string, string> = forms.mapAttributeCastToInputTypes({
                    date: 'date',
                    datetime: 'datetime-local',
                    timestamp: 'datetime-local',
                    hashed: 'password',
                    int: 'number',
                    float: 'number',
                    boolean: 'checkbox',
                }, item, attribute);
    
                if (attribute.cast && attribute.cast in castTypeMap) {
                    return {
                        name: key,
                        type: castTypeMap[attribute.cast],
                        label: textCase(key),
                        id,
                    };
                }
    
                const typeMap: Record<string, string> = forms.mapAttributeTypeToInputTypes({
                    'tinyint(1)': 'checkbox',
                    int: 'number',
                    float: 'number',
                    timestamp: 'datetime-local',
                    text: 'textarea',
                    tinytext: 'textarea',
                    mediumtext: 'textarea',
                    longtext: 'textarea',
                    date: 'date',
                }, item, attribute);
    
                if (attribute.type && attribute.type in typeMap) {
                    return {
                        name: key,
                        type: typeMap[attribute.type],
                        label: textCase(key),
                        id,
                    };
                }

                if (attribute.type?.startsWith('enum(')) {
                    // match the interior of enum(*)
                    const match = attribute.type.match(/enum\((.*)\)/);
                    if (match) {
                        return {
                            name: key,
                            type: 'select',
                            label: textCase(key),
                            id,
                            options: [
                                { label: '-- Select a value --', value: '' },
                                ...match[1].split(',').map((opt) => {
                                    const unquoted = opt.replace(/['"]+/g, '');
                                    return { label: textCase(unquoted.trim()), value: unquoted.trim() };
                                })
                            ],
                        };
                    }
                }
    
                return {
                    name: key,
                    type: 'text',
                    label: textCase(key),
                    id,
                };
            })(key);

            if (confirmed.includes(key) && baseProps) {
                return [
                    baseProps,
                    {
                        ...baseProps,
                        name: `${key}_confirmation`,
                        label: `Confirm ${baseProps.label}`,
                        id: `luminix-form-${item.getType()}-${item.getKey() || 'new'}-${key}-confirmation`,
                    }
                ];
            }

            return baseProps;
        }, 0);
    }
}

export default ReactPlugin;