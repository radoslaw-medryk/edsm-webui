import * as React from "react";
import { AssemblyData } from "../contracts/AssemblyData";
import { Branch } from "./Branch";
import { PositionAbsolute } from "./PositionAbsolute";
import { Point } from "../types/Point";
import { Size } from "../types/Size";

const styles = require("./Assembly.scss");

type BranchSizes = { [key: string]: Size | undefined };
type BranchPositions = { [key: string]: Point | undefined };
type Dragged = { branchId: string, dragPos: Point };

export type AssemblyProps = {
    data: AssemblyData;
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
        const { data } = this.props;
        const { branchPositions, dragged } = this.state;

        const getClassName = (id: string) => dragged && dragged.branchId === id ? styles.dragged : null;
        const getPosition = (id: string) => branchPositions[id] || { x: 0, y: 0 };

        return (
            <div ref={this.boxRef} className={styles.box}>
                {data.branches.map(branch =>
                    <PositionAbsolute
                        key={branch.position}
                        className={getClassName(branch.position)}
                        position={getPosition(branch.position)}
                        draggable={true}
                        onDragStart={e => this.onDragStart(e, branch.position)}
                        onDragEnd={this.onDragEnd}
                    >
                        <Branch
                            onMount={domSize => this.onBranchMount(branch.position, domSize)}
                            className={styles.branch}
                            data={branch}
                        />
                    </PositionAbsolute>
                )}
            </div>
        );
    }

    private onBranchMount = (id: string, domSize: Size) => {
        this.setState(state => ({
            branchSizes: {...state.branchSizes, [id]: domSize},
        }));
    }

    private onDragStart = (e: React.DragEvent, id: string) => {
        const dragged = e.currentTarget;
        const rect = dragged.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const dragY = e.clientY - rect.top;

        this.setState({
            dragged: { branchId: id, dragPos: { x: dragX, y: dragY }},
        });
    }

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

        this.setState(state => ({
            dragged: null,
            branchPositions: state.dragged
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

        let nextX = 0;
        let nextY = 0;
        for (const branch of branches) {
            const domSize = branchSizes[branch.position];
            if (!domSize) {
                throw new Error("Called calculateBranchPositions() but some branch domSize is unknown.");
            }

            const position = { x: nextX, y: nextY };
            result[branch.position] = position;

            nextY += domSize.height + 20;
            nextX += 20;
        }

        return result;
    }

    private preventDefaultHandler = (e: Event) => e.preventDefault();
}
