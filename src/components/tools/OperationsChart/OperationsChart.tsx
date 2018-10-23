import * as React from "react";
import { OperationBox } from "./OperationBox";
import { SelectionContextData, SelectionContext } from "../../contexts/SelectionContext";

const styles = require("./OperationsChart.scss");

export type OperationsChartProps = {
    //
};

export type OperationsChartState = {
    //
};

export class OperationsChart extends React.Component<OperationsChartProps, OperationsChartState> {
    constructor(props: OperationsChartProps) {
        super(props);
    }

    public render() {
        return (
            <SelectionContext.Consumer observedTopics={"all"} >
                {this.renderContent}
            </SelectionContext.Consumer>
        );
    }

    private renderContent = (selection: SelectionContextData) => {
        if (!selection.branch) {
            return null;
        }

        const { operations } = selection.branch;

        const isSelected = (id: string) => !!selection.operation && selection.operation.position === id;

        return (
            <div className={styles.box}>
                {operations.map(q => (
                    <OperationBox
                        key={q.position}
                        data={q}
                        isSelected={isSelected(q.position)}
                    />
                ))}
            </div>
        );
    }
}
