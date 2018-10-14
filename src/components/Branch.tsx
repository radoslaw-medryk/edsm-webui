import * as React from "react";
import { BranchData } from "../contracts/BranchData";
import { Operation } from "./Operation";
import { ClassNameProps } from "../types/props";
import classNames from "classnames";
import { Size } from "../types/Size";
import { OperationData } from "../contracts/OperationData";
import { curry } from "@radoslaw-medryk/react-curry";
import { SelectionActions } from "./cpus/SelectionCpu";

const styles = require("./Branch.scss");

export type BranchProps = ClassNameProps & {
    data: BranchData;
    selectionActions: SelectionActions;
    isSelected: boolean,
    onMount?: (domSize: Size) => void;
};

export type BranchState = {
    //
};

export class Branch extends React.PureComponent<BranchProps, BranchState> {
    private boxRef: React.RefObject<HTMLDivElement>;

    constructor(props: BranchProps) {
        super(props);
        this.boxRef = React.createRef();
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
        // tslint:disable-next-line:prefer-const
        let { className, data, isSelected } = this.props;

        className = classNames(
            styles.box,
            className,
            {
                [styles.inaccessible]: !data.isAccessible,
                [styles.selected]: isSelected,
            });

        // TODO [RM]: temp for debug purposes
        console.log(`branch '${data.position}' render().`);

        return (
            <div ref={this.boxRef} className={className}>
                <div
                    className={styles.header}
                    onClick={this.onHeaderClick}
                >
                    [ {data.position} ]
                </div>
                <div className={styles.operations}>
                    {data.operations.map(q => (
                        <Operation
                            key={q.position}
                            data={q}
                            onClick={this.onOperationClick(q)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    private onHeaderClick = () => {
        const { data, selectionActions } = this.props;
        selectionActions.setSelection({ branch: data, operation: null });
    }

    private onOperationClick = curry((operation: OperationData) => () => {
        const { data, selectionActions } = this.props;
        selectionActions.setSelection({ branch: data, operation: operation });

    });
}
