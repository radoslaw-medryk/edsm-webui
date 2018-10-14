import * as React from "react";
import { OpDefsContext } from "./OpDefsContext";
import { ConfigContext, ConfigContextData } from "./ConfigContext";

const config: ConfigContextData = {
    api: {
        // baseUrl: "http://localhost:5000/api",
        baseUrl: "https://5bc37df83e7a8b00138053c9.mockapi.io/api",
    },
};

export const ContextProviders: React.SFC<{}> = props => (
    <ConfigContext.Provider value={config}>
        <OpDefsContext.Provider>
            {props.children}
        </OpDefsContext.Provider>
    </ConfigContext.Provider>
);
