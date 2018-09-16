import * as React from 'react';
import { Decompiler } from './Decompiler';

export const ReactApp : React.SFC<{}> = () => (
    <>
        <h1>Hello World!</h1>
        <Decompiler/>
    </>
);