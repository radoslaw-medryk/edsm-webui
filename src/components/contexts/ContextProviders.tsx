import * as React from "react";
import { OpDefsContext } from "./OpDefsContext";
import { ConfigContext, ConfigContextData } from "./ConfigContext";

const config: ConfigContextData = {
    api: {
        // baseUrl: "http://localhost:5000/api",
        // baseUrl: "http://localhost:8888/huge",
        baseUrl: "http://localhost:8888/little",
    },
};

export const ContextProviders: React.SFC<{}> = props => (
    <ConfigContext.Provider value={config}>
        <OpDefsContext.Provider>
            {props.children}
        </OpDefsContext.Provider>
    </ConfigContext.Provider>
);
