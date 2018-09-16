import * as React from "react";
import { AssemblyData } from "contracts/AssemblyData";
import { Branch } from "./Branch";
import * as styles from "./Assembly.scss";

export interface Props {
    data: AssemblyData;
}

export const Assembly: React.SFC<Props> = (props) => (
    <div className={styles.assembly}>
        {props.data.branches.map(q => <Branch key={q.position} data={q}/>)}
    </div>
);