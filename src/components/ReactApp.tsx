import * as React from "react";
import { Decompiler } from "./Decompiler";
import { ContextProviders } from "./contexts/ContextProviders";
import { Arrow } from "./Arrow";

const points = [
    {x: 0, y: 0},
    {x: -30, y: 0},
    {x: -30, y: 80},
    {x: 80, y: 80},
];

export const ReactApp: React.SFC<{}> = () => (
    <ContextProviders>
        <h1>Ethereum Decompiler</h1>
        <Arrow color="#414141" points={points}/>
        <Decompiler/>
    </ContextProviders>
);
