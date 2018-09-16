import * as React from "react";
import { OperationData } from "contracts/OperationData";

export interface Props {
    data: OperationData;
};

export const Operation: React.SFC<Props> = (props) => (
    <div>{props.data.opCode}</div>    
);
