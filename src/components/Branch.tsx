import * as React from "react";
import { BranchData } from "contracts/BranchData";
import { Operation } from "./Operation";

export interface Props {
    data: BranchData;
};

export const Branch: React.SFC<Props> = (props) => (
    <div>
        <div>[ {props.data.position} ]</div>
        <div>{props.data.operations.map(q => <Operation key={q.position} data={q}/>)}</div>
    </div>
);
