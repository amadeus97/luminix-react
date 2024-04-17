import React from "react";
import QueryContext from "../contexts/QueryContext";


export default function useCurrentQuery() {

    return React.useContext(QueryContext);
}
