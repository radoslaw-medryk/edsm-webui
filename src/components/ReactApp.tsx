import * as React from "react";
import { Decompiler } from "./Decompiler";
import { ContextProviders } from "./contexts/ContextProviders";

export const ReactApp: React.SFC<{}> = () => (
    <ContextProviders>
        <h1>Ethereum Decompiler</h1>
        <p style={{ color: "#666" }}>Using mock API right now, only predefined data available.</p>
        <Decompiler/>
    </ContextProviders>
);
