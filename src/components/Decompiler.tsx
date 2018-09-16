import * as React from "react";
import { AssemblyContainer } from "./AssemblyContainer";

export interface Props {
    //
}

interface State {
    text: string;
    code: string | null;
}

export class Decompiler extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: "",
            code: null
        };
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmitted.bind(this)}>
                    <textarea onChange={this.onTextChanged.bind(this)}/>
                    <input type="submit" value="Decompile"/>
                </form>

                { this.state.code
                    ? <AssemblyContainer code={this.state.code}/>
                    : null }
            </div>
        );
    }

    private onTextChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            text: event.currentTarget.value
        });
    }

    private onSubmitted(event: React.SyntheticEvent) {
        event.preventDefault();
        
        this.setState({
            code: this.state.text
        });
    }
}