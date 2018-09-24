import "@babel/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactApp } from "./components/ReactApp";

ReactDOM.render(
    <ReactApp/>,
    document.getElementById("react-app")
);
