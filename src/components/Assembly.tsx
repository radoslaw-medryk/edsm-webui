import * as React from "react";
import { Branch } from "./Branch";
import { Point, Size } from "@radoslaw-medryk/react-basics";
import { curry } from "@radoslaw-medryk/react-curry";
import { AssemblyData } from "../contracts/AssemblyData";
import { DragDropCanvas, DragDropElement, DragDropElementDetails } from "@radoslaw-medryk/react-dragdrop";
import classNames from "classnames";
import { BranchData } from "../contracts/BranchData";
import { SelectionContextData, SelectionContext, ClearSelectionFunc } from "./contexts/SelectionContext";

const styles = require("./Assembly.scss");

type BranchSizes = { [key: string]: Size | undefined };
type BranchPositions = { [key: string]: Point | undefined };

export type AssemblyProps = {
    data: AssemblyData;
};

export type AssemblyState = {
    branchSizes: BranchSizes;
    branchPositions: BranchPositions;
};

export class Assembly extends React.PureComponent<AssemblyProps, AssemblyState> {
    private startPosition: Point;

    constructor(props: AssemblyProps) {
        super(props);

        this.startPosition = { x: 0, y: 0 };

        this.state = {
            branchSizes: {},
            branchPositions: {},
        };
    }

    public componentDidUpdate(prevProps: AssemblyProps, prevState: AssemblyState) {
        const prevMountedBranchCount = Object.keys(prevState.branchSizes).length;
        const mountedBranchCount = Object.keys(this.state.branchSizes).length;
        const allBranchCount = this.props.data.branches.length;

        if (prevMountedBranchCount === mountedBranchCount) {
            return;
        }

        if (mountedBranchCount !== allBranchCount) {
            return;
        }

        // TODO [RM]: handle when Assembly component is reused with new branches
        // All branch mounted
        const branchPositions = this.calculateBranchPositions();
        this.setState({
            branchPositions: branchPositions,
        });
     }

    public render() {
        const { data } = this.props;
        const { branchPositions } = this.state;

        // TODO [RM]: idea for State Management library:
        // TODO [RM]: Context base library that have custom consumers options
        // TODO [RM]: for subscribing only to Actions (functions changing state), State (data) or both.

        // TODO [RM]: Something like:
        /*
        <Consumer topics={["number"]}>
            {(state, actions) => {
                <div>State: {state.number}</div>
                <button onClick={() => actions.changeState(42)}></button>
            }}
        </Consumer>

        // or:

        <Consumer>
            {(actions) => {
                <button onClick={() => actions.changeState(42)}></button>
            }}
        </Consumer>
        */

        // observedTopics="none", as we are only interested in clearSelection,
        // which doesn't ever change.
        return (
            <SelectionContext.Consumer observedTopics="none">
                {this.renderContent(data, branchPositions)}
            </SelectionContext.Consumer>
        );
    }

    private renderContent = curry(
        (data: AssemblyData, branchPositions: BranchPositions) =>
        (selection: SelectionContextData) => {
            const getPosition = (id: string) => branchPositions[id] || this.startPosition;
            const { clearSelection } = selection.actions;

            return (
                <DragDropCanvas
                    className={styles.box}
                    onClick={this.onClick(clearSelection)}
                >
                    {data.branches.map(branch => (
                        <DragDropElement
                            key={branch.position}
                            position={getPosition(branch.position)}
                            onDropped={this.onElementDropped(branch.position)}
                        >
                            {this.renderBranch(branch)}
                        </DragDropElement>
                    ))}
                </DragDropCanvas>
            );
        }
    );

    private renderBranch = curry(
        (branch: BranchData) =>
        (details: DragDropElementDetails) => {
            const branchClassName = classNames(
                styles.branch,
                {
                    [styles.dragged]: details.isDragged,
                }
            );

            return (
                <Branch
                    onMount={this.onBranchMount(branch.position)}
                    className={branchClassName}
                    data={branch}
                />
            );
        }
    );

    private onElementDropped = curry((id: string) => (position: Point) => {
        this.setState(state => ({
            branchPositions: { ...state.branchPositions, [id]: position },
        }));
    });

    private onClick = (clearSelection: ClearSelectionFunc) => (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) {
            return;
        }

        clearSelection();
    }

    private onBranchMount = curry((id: string) => (domSize: Size) => {
        this.setState(state => ({
            branchSizes: {...state.branchSizes, [id]: domSize},
        }));
    });

    private calculateBranchPositions = (): BranchPositions => {
        const { branches } = this.props.data;
        const { branchSizes } = this.state;
        const result: BranchPositions = {};

        const nextX = 0;
        let nextY = 0;
        for (const branch of branches) {
            const domSize = branchSizes[branch.position];
            if (!domSize) {
                throw new Error("Called calculateBranchPositions() but some branch domSize is unknown.");
            }

            const position = { x: nextX, y: nextY };
            result[branch.position] = position;

            nextY += domSize.height + 20;
            // nextX += 20;
        }

        return result;
    }
}
