import * as React from "react";
import { OpDefs } from "./OpDefs";

export const ApiContextProviders: React.SFC<{}> = props => (
    <OpDefs.Provider>
        {props.children}
    </OpDefs.Provider>
);
