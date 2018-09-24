import * as React from "react";
import { OpDefs } from "./contexts/OpDefs";
import { AxiosStatus } from "@radoslaw-medryk/react-axios";
import { Hex } from "../types/Hex";

export type OpCodeNameProps = {
    opCode: Hex;
};

export const OpCodeName: React.SFC<OpCodeNameProps> = props => (
    <OpDefs.Consumer>
        {context => <>{
            context.status === AxiosStatus.Success
                ? context.data.data.value[props.opCode].name
                : props.opCode
        }</>}
    </OpDefs.Consumer>
);
