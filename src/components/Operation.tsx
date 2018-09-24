import * as React from "react";
import { OperationData } from "../contracts/OperationData";
import { OpCodeName } from "./OpCodeName";

const styles = require("./Operation.scss");

export type OperationProps = {
    data: OperationData;
};

export type OperationState = {
    //
};

export class Operation extends React.Component<OperationProps, OperationState> {
    constructor(props: OperationProps) {
        super(props);
    }

    public render() {
        const { data } = this.props;

        return (
            <div className={styles.box}>
                {/* <div className={styles.position}>{props.data.position}</div> */}
                <div className={styles.opcode}><OpCodeName opCode={data.opCode}/></div>
                <div className={styles.input}>{data.inCodeInput}</div>
            </div>
        );
    }
}
