import * as React from "react";
import { BranchData } from "../contracts/BranchData";
import { Operation } from "./Operation";
import { ClassNameProps } from "../types/props";
import classNames from "classnames";
import { Size } from "@radoslaw-medryk/react-basics";
import { OperationData } from "../contracts/OperationData";
import { curry } from "@radoslaw-medryk/react-curry";
import { SelectionContextData, SelectionContext, SetSelectionFunc } from "./contexts/SelectionContext";

const styles = require("./Branch.scss");

export type BranchProps = ClassNameProps & {
    data: BranchData;
    onMount?: (domSize: Size) => void;
};

export type BranchState = {
    //
};

export class Branch extends React.PureComponent<BranchProps, BranchState> {
    private boxRef: React.RefObject<HTMLDivElement>;
    private observedTopics: string[];

    constructor(props: BranchProps) {
        super(props);
        this.boxRef = React.createRef();
        this.observedTopics = [props.data.position];
    }

    public componentDidMount() {
        const ref = this.boxRef.current;
        if (ref === null) {
            throw new Error("ref === null");
        }

        // TODO [RM]: research possible caveats with accessing ref's DOM size in componentDidMount().
        this.props.onMount && this.props.onMount({ width: ref.offsetWidth, height: ref.offsetHeight });
    }

    public render() {
        const { className, data } = this.props;

        return (
            <SelectionContext.Consumer observedTopics={this.observedTopics}>
                {this.renderContent(className, data)}
            </SelectionContext.Consumer>
        );
    }

    private renderContent = curry(
        (className: string | undefined, data: BranchData) =>
        (selection: SelectionContextData) => {
            const isSelected = selection.branch === data;
            const { setSelection } = selection.actions;

            const boxClassName = classNames(
                styles.box,
                className,
                {
                    [styles.inaccessible]: !data.isAccessible,
                    [styles.selected]: isSelected,
                }
            );

            return (
                <div ref={this.boxRef} className={boxClassName}>
                    <div
                        className={styles.header}
                        onClick={this.onHeaderClick(data, setSelection)}
                    >
                        [ {data.position} ]
                    </div>
                    <div className={styles.operations}>
                        {data.operations.map(q => (
                            <Operation
                                key={q.position}
                                data={q}
                                onClick={this.onOperationClick(data, setSelection, q)}
                            />
                        ))}
                    </div>
                </div>
            );
        }
    );

    private onHeaderClick = curry(
        (data: BranchData, setSelection: SetSelectionFunc) =>
        () => {
            setSelection({ branch: data, operation: null });
        }
    );

    private onOperationClick = curry(
        (data: BranchData, setSelection: SetSelectionFunc, operation: OperationData) =>
        () => {
            setSelection({ branch: data, operation: operation });
        }
    );
}
