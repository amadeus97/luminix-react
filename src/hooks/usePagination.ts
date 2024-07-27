import React from "react";
import PaginationContext, { PaginationContextValue } from "../contexts/PaginationContext";

/**
 * 
 * Gets data from the PaginationContext.
 * 
 */
export default function usePagination(): PaginationContextValue {

    return React.useContext(PaginationContext);
}
