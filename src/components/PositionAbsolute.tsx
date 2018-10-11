import * as React from "react";
import { Point } from "../types/Point";
import { ElementProps } from "../types/props";

export type PositionAbsoluteProps = {
    position?: Point;
    boxRef?: React.Ref<HTMLDivElement>;
} & ElementProps<HTMLDivElement>;

export const PositionAbsolute: React.SFC<PositionAbsoluteProps> = props => {
    const { children, boxRef, position, ...restProps } = props;

    const style: React.CSSProperties = {position: "absolute"};
    if (position) {
        style.left = position.x;
        style.top = position.y;
    }

    return (
        <div ref={boxRef} {...restProps} style={style}>
            {children}
        </div>
    );
};
