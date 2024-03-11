import { Model } from "@luminix/core";
import React from "react";
import useOn from "./useOn";

type UseAttributesOptions = {
    cast?: boolean;
};

const castAttributes = (item: Model) => {
    return Object.keys(item.attributes).reduce((acc, key) => {
        return {
            ...acc,
            [key]: item[key],
        };
    }, {});
};

export default function useAttributes(item: Model, options: UseAttributesOptions = {}) {

    const {
        cast = true,
    } = options;

    const [attributes, setAttributes] = React.useState(
        cast 
            ? castAttributes(item)
            : item.attributes
    );

    const handleChange = React.useCallback(() => {
        setAttributes(
            cast 
                ? castAttributes(item)
                : item.attributes
        );
    }, [item, cast]);

    useOn(item, 'change', handleChange);

    return attributes;
}
