import * as React from "react";
import { Axios, AxiosContext, AxiosStatus } from "@radoslaw-medryk/react-axios";
import { ResponseEnvelope } from "../../contracts/ResponseEnvelope";
import { OpDefData } from "../../contracts/OpDefData";
import { ConfigContext } from "./ConfigContext";

type DataType = {
    [opCode: string]: OpDefData,
};

export type OpDefsContextData = AxiosContext<ResponseEnvelope<DataType>, any>;

const Context = React.createContext<OpDefsContextData>({
    call: () => null,
    cancel: () => null,
    data: null,
    error: null,
    status: AxiosStatus.NotCalled,
});

export const OpDefsProvider: React.SFC<{}> = props => (
    <ConfigContext.Consumer>
        {config => (
            <Axios
                request={axios => axios.get("/OpDefs", { baseURL: config.api.baseUrl })}
                initCall={true}
            >
                {context => <Context.Provider value={context}>
                    {props.children}
                </Context.Provider>}
            </Axios>
        )}
    </ConfigContext.Consumer>
);

export const OpDefsContext = {
    Consumer: Context.Consumer,
    Provider: OpDefsProvider,
};
