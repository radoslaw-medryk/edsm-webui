import * as React from "react";
import { Axios, AxiosContext, AxiosStatus } from "@radoslaw-medryk/react-axios";
import { ResponseEnvelope } from "../../contracts/ResponseEnvelope";
import { OpDefData } from "../../contracts/OpDefData";

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
    <Axios
        request={axios => axios.get("http://localhost:5000/api/OpDefs")}
        initCall={true}
    >
        {context => <Context.Provider value={context}>
            {props.children}
        </Context.Provider>}
    </Axios>
);

export const OpDefs = {
    Consumer: Context.Consumer,
    Provider: OpDefsProvider,
};
