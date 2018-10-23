import "@babel/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactApp } from "./components/ReactApp";

// TODO [RM]: dev purposes only:
// tslint:disable-next-line:no-implicit-dependencies //TODO [RM]: why does it happens?
import { whyDidYouUpdate } from "why-did-you-update";
whyDidYouUpdate(React);

ReactDOM.render(
    <ReactApp/>,
    document.getElementById("react-app")
);
