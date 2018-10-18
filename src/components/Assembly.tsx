import * as React from "react";
import { Branch } from "./Branch";
import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { curry } from "@radoslaw-medryk/react-curry";
import { SelectionContext, SelectionActions } from "./cpus/SelectionCpu";
import { AssemblyData } from "../contracts/AssemblyData";
import { DragDropCanvas } from "./DragDropCanvas";
import { DragDropElement, DragDropElementDetails } from "./DragDropElement";
import classNames from "classnames";
import { BranchData } from "../contracts/BranchData";

const styles = require("./Assembly.scss");

type BranchSizes = { [key: string]: Size | undefined };
type BranchPositions = { [key: string]: Point | undefined };

export type AssemblyProps = {
    data: AssemblyData;
    selection: SelectionContext;
};

export type AssemblyState = {
    branchSizes: BranchSizes;
    branchPositions: BranchPositions;
};

export class Assembly extends React.PureComponent<AssemblyProps, AssemblyState> {
    constructor(props: AssemblyProps) {
        super(props);

        this.state = {
            branchSizes: {},
            branchPositions: {},
        };
    }

    public componentDidUpdate(prevProps: AssemblyProps, prevState: AssemblyState) {
        console.log("Assembly: componentDidUpdate, prevProps:", prevProps, "props:", this.props);
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
        const { data, selection } = this.props;
        const { branchPositions } = this.state;

        const isSelected = (id: string) => !!selection.branch && selection.branch.position === id;
        const getPosition = (id: string) => branchPositions[id] || { x: 0, y: 0 };

        return (
            <DragDropCanvas
                className={styles.box}
                onClick={this.onClick}
            >
                {data.branches.map(branch => (
                    <DragDropElement
                        key={branch.position}
                        position={getPosition(branch.position)}
                        onDropped={this.onElementDropped(branch.position)}
                    >
                        {this.renderBranch(branch, isSelected(branch.position), selection.actions)}
                    </DragDropElement>
                ))}
            </DragDropCanvas>
        );
    }

    private renderBranch = curry(
        (branch: BranchData, isSelected: boolean, selectionActions: SelectionActions) =>
        (details: DragDropElementDetails) => {
            const className = classNames(
                styles.branch,
                {
                    [styles.dragged]: details.isDragged,
                }
            );

            return (
                <Branch
                    onMount={this.onBranchMount(branch.position)}
                    className={className}
                    data={branch}
                    selectionActions={selectionActions}
                    isSelected={isSelected}
                />
            );
        }
    );

    private onElementDropped = curry((id: string) => (position: Point) => {
        this.setState(state => ({
            branchPositions: { ...state.branchPositions, [id]: position },
        }));
    });

    private onClick = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) {
            return;
        }

        this.props.selection.actions.clearSelection();
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
