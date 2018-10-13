import * as React from "react";
import { Branch } from "./Branch";
import { PositionAbsolute } from "./PositionAbsolute";
import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { Arrow } from "./Arrow";
import { curry } from "@radoslaw-medryk/react-curry";
import classNames from "classnames";
import { SelectionContext } from "./cpus/SelectionCpu";
import { AssemblyData } from "../contracts/AssemblyData";
import { DragDropCanvas } from "./DragDropCanvas";
import { DragDropElement } from "./DragDropElement";

const styles = require("./Assembly.scss");

type BranchSizes = { [key: string]: Size | undefined };
type BranchPositions = { [key: string]: Point | undefined };
type Dragged = { branchId: string, dragPos: Point };

// TODO [RM]: add select branch feature and display branch details somewhere.

export type AssemblyProps = {
    data: AssemblyData;
    selection: SelectionContext;
};

export type AssemblyState = {
    branchSizes: BranchSizes;
    branchPositions: BranchPositions;

    dragged: Dragged | null;
};

export class Assembly extends React.Component<AssemblyProps, AssemblyState> {
    private boxRef: React.RefObject<HTMLDivElement>;

    constructor(props: AssemblyProps) {
        super(props);
        this.boxRef = React.createRef();

        this.state = {
            branchSizes: {},
            branchPositions: {},
            dragged: null,
        };
    }

    public componentDidMount() {
        const box = this.boxRef.current;
        if (box === null) {
            throw new Error("this.boxRef === null");
        }

        box.addEventListener("dragover", this.preventDefaultHandler);
        box.addEventListener("dragenter", this.preventDefaultHandler);
        box.addEventListener("dragleave", this.preventDefaultHandler);
        box.addEventListener("drag", this.onDrag);
        box.addEventListener("drop", this.onDrop);

    }

    public componentWillUnmount() {
        const box = this.boxRef.current;
        if (box === null) {
            throw new Error("this.boxRef === null");
        }

        box.removeEventListener("dragover", this.preventDefaultHandler);
        box.removeEventListener("dragenter", this.preventDefaultHandler);
        box.removeEventListener("dragleave", this.preventDefaultHandler);
        box.removeEventListener("drag", this.onDrag);
        box.removeEventListener("drop", this.onDrop);
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
        const { data, selection } = this.props;
        const { branchPositions, dragged } = this.state;

        const getClassName = (id: string) => classNames({
            [styles.dragged]: dragged && dragged.branchId === id,
        });
        const getPosition = (id: string) => branchPositions[id] || { x: 0, y: 0 };

        const isSelected = (id: string) => !!selection.branch && selection.branch.position === id;

        const initElements = {
            ["hiho"]: { position: { x: 0, y: 0 } },
            ["zoey"]: { position: { x: 50, y: 0 } },
        };

        return (
            <div
                ref={this.boxRef}
                className={styles.box}
                onClick={this.onClick}
            >
                <DragDropCanvas
                    style={{ width: 500, height: 500, border: "3px dotted pink" }}
                    initElements={initElements}
                >
                    <DragDropElement style={{ padding: 30, background: "lightblue" }} elementId="hiho">
                        Hello
                    </DragDropElement>
                    <DragDropElement style={{ padding: 30, background: "lightblue" }} elementId="zoey">
                        Zoey!
                    </DragDropElement>
                </DragDropCanvas>
                <Arrow color="#414141" points={[getPosition("0x00"), getPosition("0x02")]}/>
                {data.branches.map(branch =>
                    <PositionAbsolute
                        key={branch.position}
                        className={getClassName(branch.position)}
                        position={getPosition(branch.position)}
                        draggable={true}
                        onDragStart={this.onDragStart(branch.position)}
                        onDragEnd={this.onDragEnd}
                    >
                        <Branch
                            onMount={this.onBranchMount(branch.position)}
                            className={styles.branch}
                            data={branch}
                            selectionActions={selection.actions}
                            isSelected={isSelected(branch.position)}
                        />
                    </PositionAbsolute>
                )}
            </div>
        );
    }

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

    private onDragStart = curry((id: string) => (e: React.DragEvent) => {
        const dragged = e.currentTarget;
        const rect = dragged.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const dragY = e.clientY - rect.top;

        this.setState({
            dragged: { branchId: id, dragPos: { x: dragX, y: dragY }},
        });
    });

    private onDragEnd = (e: React.DragEvent) => {
        // TODO [RM]: is ALWAYS `dragend` fired AFTER `drop`?
        this.setState({
            dragged: null,
        });
    }

    private onDrop = (e: MouseEvent) => {
        if (!this.boxRef.current) {
            throw new Error("this.boxRef.current === null | undefined.");
        }

        const rect = this.boxRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            console.log("CANCEL1");
            e.preventDefault(); // TODO [RM]: needed?
            return;
        }

        const canDrop = (state: AssemblyState) => {
            const dragged = state.dragged;
            if (!dragged) {
                return false;
            }

            if (x < dragged.dragPos.x || y < dragged.dragPos.y) {
                console.log("CANCEL1");
                e.preventDefault(); // TODO [RM]: needed?
                return false;
            }

            const draggedSize = state.branchSizes[dragged.branchId];
            if (!draggedSize) {
                throw new Error("draggedSize === null | undefined.");
            }

            if (x > rect.width - draggedSize.width + dragged.dragPos.x
            || y > rect.height - draggedSize.height + dragged.dragPos.y) {
                console.log("CANCEL1");
                e.preventDefault(); // TODO [RM]: needed?
                return false;
            }

            return true;
        };

        this.setState(state => ({
            dragged: null,
            branchPositions: state.dragged && canDrop(state)
                ? {
                    ...state.branchPositions,
                    [state.dragged.branchId]: {
                        x: x - state.dragged.dragPos.x,
                        y: y - state.dragged.dragPos.y,
                    },
                }
                : {...state.branchPositions},
        }));
    }

    private onDrag = (e: Event) => {
        //
    }

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

    private preventDefaultHandler = (e: Event) => e.preventDefault();
}
