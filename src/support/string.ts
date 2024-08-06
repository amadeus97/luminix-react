import _ from "lodash";


export function textCase(text: string) {
    return _.upperFirst(_.snakeCase(text)).replaceAll('_', ' ');
}

