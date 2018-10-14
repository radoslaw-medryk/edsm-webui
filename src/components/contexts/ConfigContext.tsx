import * as React from "react";
import { ApiConfig } from "../../contracts/ApiConfig";

export type ConfigContextData = {
    api: ApiConfig;
};

export const ConfigContext = React.createContext<ConfigContextData>({
    api: {
        baseUrl: "",
    },
});
