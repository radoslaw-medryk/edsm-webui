import * as React from "react";
import { OpDefs } from "./OpDefs";
import { ConfigContext, ConfigContextData } from "./ConfigContext";

const config: ConfigContextData = {
    api: {
        baseUrl: "http://localhost:5000/api",
    },
};

export const ContextProviders: React.SFC<{}> = props => (
    <ConfigContext.Provider value={config}>
        <OpDefs.Provider>
            {props.children}
        </OpDefs.Provider>
    </ConfigContext.Provider>
);
