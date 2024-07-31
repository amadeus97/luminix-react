import React from "react";
import ModelFormContext from "../contexts/ModelFormContext";

export default function useModelFormItem() {
    const { item } = React.useContext(ModelFormContext);

    return item;
}