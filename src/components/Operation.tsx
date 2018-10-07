import * as React from "react";
import { OperationData } from "../contracts/OperationData";
import { OpCodeName } from "./OpCodeName";

const styles = require("./Operation.scss");

export type OperationProps = {
    data: OperationData;
    onClick?: () => void;
};

export type OperationState = {
    //
};

export class Operation extends React.PureComponent<OperationProps, OperationState> {
    constructor(props: OperationProps) {
        super(props);
    }

    public render() {
        const { data, onClick } = this.props;

        return (
            <div className={styles.box} onClick={onClick}>
                {/* <div className={styles.position}>{props.data.position}</div> */}
                <div className={styles.opcode}><OpCodeName opCode={data.opCode}/></div>
                <div className={styles.input}>{data.inCodeInput}</div>
            </div>
        );
    }
}
