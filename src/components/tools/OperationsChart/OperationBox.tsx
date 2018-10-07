import * as React from "react";
import { OperationData } from "../../../contracts/OperationData";
import { OpCodeName } from "../../OpCodeName";
import { AssemblyContextData } from "../../contexts/AssemblyContext";
import classNames from "classnames";

const styles = require("./OperationBox.scss");

export type OperationBoxProps = {
    data: OperationData;
    context: AssemblyContextData;
};

export type OperationBoxState = {
    //
};

export class OperationBox extends React.Component<OperationBoxProps, OperationBoxState> {
    constructor(props: OperationBoxProps) {
        super(props);
    }

    public render() {
        const { data, context } = this.props;
        const { opCode } = data;

        const isSelected = context.selection.operation === data;

        const className = classNames(
            styles.box,
            {
                [styles.selected]: isSelected,
            }
        );

        return (
            <div className={className}>
                <OpCodeName opCode={opCode}/>
            </div>
        );
    }
}
