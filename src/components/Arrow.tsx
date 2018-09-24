import * as React from "react";
import { Point } from "../types/Point";

export type ArrowProps = {
    color: string;
    points: Point[];
};

export const Arrow: React.SFC<ArrowProps> = ({ points, color }) => {
    let d: string = "M0 0";

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    for (const point of points) {
        // TODO [RM]: is using `+=` here a performance problem?
        d += ` L${point.x} ${point.y}`;

        minX = point.x < minX ? point.x : minX;
        minY = point.y < minY ? point.y : minY;
        maxX = point.x > maxX ? point.x : maxX;
        maxY = point.y > maxY ? point.y : maxY;
    }

    const width = maxX - minY;
    const height = maxY - minY;

    return (
        <div style={{ transform: `translate(${minX}px,${minY}px)` }}>
            <svg
                width={width}
                height={height}
                stroke={color}
                fill="none"
                viewBox={`${minX} ${minY} ${width} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d={d}/>
            </svg>
        </div>
    );
};
