import "@babel/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactApp } from "./components/ReactApp";

// TODO [RM]: dev purposes only:
import { whyDidYouUpdate } from "why-did-you-update";
whyDidYouUpdate(React);

ReactDOM.render(
    <ReactApp/>,
    document.getElementById("react-app")
);
