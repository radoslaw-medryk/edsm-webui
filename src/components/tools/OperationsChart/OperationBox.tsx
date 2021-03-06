import * as React from "react";
import { OperationData } from "../../../contracts/OperationData";
import { OpCodeName } from "../../OpCodeName";
import classNames from "classnames";

const styles = require("./OperationBox.scss");

export type OperationBoxProps = {
    data: OperationData;
    isSelected: boolean;
};

export type OperationBoxState = {
    //
};

export class OperationBox extends React.PureComponent<OperationBoxProps, OperationBoxState> {
    constructor(props: OperationBoxProps) {
        super(props);
    }

    public render() {
        const { data, isSelected } = this.props;
        const { opCode } = data;

        const boxClassName = classNames(
            styles.box,
            {
                [styles.selected]: isSelected,
            }
        );

        return (
            <div className={boxClassName}>
                <OpCodeName opCode={opCode}/>
            </div>
        );
    }
}
