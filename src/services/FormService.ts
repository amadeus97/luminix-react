import { Reducible, Str, ReducerCallback, Collection } from '@luminix/support';
import { collect, Model, ModelAttribute, ModelType } from '@luminix/core';
import { FormServiceBase, FormServiceInterface, InputPropTypeMap } from '../types/Form';
import Select from '../components/Form/Input/Select';
import Radio from '../components/Form/Input/Radio';
import Checkbox from '../components/Form/Input/Checkbox';
import Textarea from '../components/Form/Input/Textarea';
import DatetimeLocal from '../components/Form/Input/DatetimeLocal';
import Text from '../components/Form/Input/Text';

class RawFormService implements FormServiceBase {
    
    getFormInputComponent(type: string): React.ElementType {
        return this.replaceFormInputComponent(
            this.switchInputType(type),
            type
        );
    }

    getDefaultInputsForModel(item: ModelType, confirmed: string[] = []) {
        const modelType = item.getType();
        const attributes = collect(Model.schema(modelType).attributes);

        const basePropsArray = item.fillable.flatMap((key) => {
            return this.getDefaultInputProps(
                this.makeFormAttributesFor(key, { attributes, confirmed, item }),
                { attributes, confirmed, item }
            );
        });

        return this[`selectDefaultInputsFor${Str.studly(modelType)}`](basePropsArray, item);
    }

    

    private switchInputType(type: keyof InputPropTypeMap) {

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
    }


    private makeFormAttributesFor(
        key: string, 
        { attributes, item, confirmed }: { attributes: Collection<ModelAttribute>, item: ModelType, confirmed: string[] }
    ) {
        const baseProps = ((key) => {
            const attribute = attributes.where('name', key).first();

            const id = `luminix-form-${item.getType()}-${item.getKey() || 'new'}-${key}`;

            if (!attribute) {
                return null;
            }

            const castTypeMap: Record<string, string> = this.mapAttributeCastToInputTypes({
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
                    label: Str.readable(key),
                    id,
                };
            }

            const typeMap: Record<string, string> = this.mapAttributeTypeToInputTypes({
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
                    label: Str.readable(key),
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
                        label: Str.readable(key),
                        id,
                        options: [
                            { label: '-- Select a value --', value: '' },
                            ...match[1].split(',').map((opt) => {
                                const unquoted = opt.replace(/['"]+/g, '');
                                return { label: Str.readable(unquoted.trim()), value: unquoted.trim() };
                            })
                        ],
                    };
                }
            }

            return {
                name: key,
                type: 'text',
                label: Str.readable(key),
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
    }

    [reducer: string]: ReducerCallback;

}

const FormService: FormServiceInterface = Reducible(RawFormService);

export default FormService;
