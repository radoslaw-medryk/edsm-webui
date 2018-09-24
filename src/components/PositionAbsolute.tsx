import * as React from "react";
import { Point } from "../types/Point";
import { ElementProps } from "../types/props";

export type PositionAbsoluteProps = {
    position?: Point;
} & ElementProps<HTMLDivElement>;

export const PositionAbsolute: React.SFC<PositionAbsoluteProps> = props => {
    const { children, position, ...restProps } = props;

    const style: React.CSSProperties = {position: "absolute"};
    if (position) {
        style.left = position.x;
        style.top = position.y;
    }

    return (
        <div {...restProps} style={style}>
            {children}
        </div>
    );
};
