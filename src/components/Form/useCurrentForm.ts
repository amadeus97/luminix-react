import React from "react";
import FormContext from "../../contexts/FormContext";
import { UseForm } from "../../types/Form";

/**
 * 
 * Returns the current form
 * 
 * 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useCurrentForm(): UseForm<any> {

    const { form } = React.useContext(FormContext);

    return form;
}
