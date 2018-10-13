import * as React from "react";
import { Point } from "../types/Point";
import { ElementProps } from "../types/props";

export type PositionAbsoluteProps = {
    position: Point;
    boxRef?: React.Ref<HTMLDivElement>;
} & ElementProps<HTMLDivElement>;

export const PositionAbsolute: React.SFC<PositionAbsoluteProps> = props => {
    // tslint:disable-next-line:prefer-const
    let { children, boxRef, style, position, ...rest } = props;

    style = {
        ...style,
        position: "absolute",
        left: position.x,
        top: position.y,
    };

    return (
        <div {...rest} ref={boxRef} style={style}>
            {children}
        </div>
    );
};
