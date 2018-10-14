import * as React from "react";
import { OpDefsContext } from "./contexts/OpDefsContext";
import { AxiosStatus } from "@radoslaw-medryk/react-axios";
import { Hex } from "../types/Hex";

export type OpCodeNameProps = {
    opCode: Hex;
};

export const OpCodeName: React.SFC<OpCodeNameProps> = props => (
    <OpDefsContext.Consumer>
        {context => {
            if (context.status !== AxiosStatus.Success) {
                return props.opCode;
            }

            const opDef = context.data.data.value[props.opCode];
            if (!opDef) {
                return props.opCode;
            }

            return opDef.name;
        }}
    </OpDefsContext.Consumer>
);
