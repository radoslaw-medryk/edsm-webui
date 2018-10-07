import * as React from "react";
import { OperationData } from "../../../contracts/OperationData";
import { OpCodeName } from "../../OpCodeName";

const styles = require("./OperationBox.scss");

export type OperationBoxProps = {
    data: OperationData;
};

export type OperationBoxState = {
    //
};

export class OperationBox extends React.Component<OperationBoxProps, OperationBoxState> {
    constructor(props: OperationBoxProps) {
        super(props);
    }

    public render() {
        const { data } = this.props;
        const { opCode } = data;

        return (
            <div className={styles.box}>
                <OpCodeName opCode={opCode}/>
            </div>
        );
    }
}
