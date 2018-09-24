import * as React from "react";
import { Decompiler } from "./Decompiler";
import { ApiContextProviders } from "./contexts/ApiContextProviders";
import { Arrow } from "./Arrow";

const points = [
    {x: 0, y: 0},
    {x: -30, y: 0},
    {x: -30, y: 80},
    {x: 80, y: 80},
];

export const ReactApp: React.SFC<{}> = () => (
    <ApiContextProviders>
        <h1>Hello World!</h1>
        <Arrow color="#414141" points={points}/>
        <Decompiler/>
    </ApiContextProviders>
);
