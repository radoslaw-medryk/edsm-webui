import * as React from "react";
import { PubSubContext, PubSubContextData } from "./contexts/PubSubContext";
import { curry } from "@radoslaw-medryk/react-curry";

export type TestComponentProps = {
    //
};

export type TestComponentState = {
    selectedId: string | null;
};

export class TestComponent extends React.PureComponent<TestComponentProps, TestComponentState> {
    private topics: string[];

    constructor(props: TestComponentProps) {
        super(props);

        this.topics = ["test1", "test2"];

        this.state = {
            selectedId: null,
        };
    }

    public render() {
        return (
            <>
                <button onClick={this.setSelected(null)}>null</button>
                <button onClick={this.setSelected("test1")}>test1</button>
                <button onClick={this.setSelected("test2")}>test2</button>
                <button onClick={this.setSelected("test3")}>test3</button>
                <button onClick={this.setSelected("test4")}>test4</button>
                <PubSubContext.Provider value={this.state}>
                    <PubSubContext.Consumer topics={this.topics}>
                        {this.renderContent}
                    </PubSubContext.Consumer>
                </PubSubContext.Provider>
            </>
        );
    }

    private renderContent = (context: PubSubContextData) => {
        return <div>SelectedId: {context.selectedId}</div>;
    }

    private setSelected = curry((selectedId: string | null) => () => {
        this.setState({
            selectedId: selectedId,
        });
    });
}
