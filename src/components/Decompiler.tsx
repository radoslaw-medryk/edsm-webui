import * as React from "react";
import { Axios, AxiosContext, AxiosStatus } from "@radoslaw-medryk/react-axios";
import { Assembly } from "./Assembly";
import { ResponseEnvelope } from "../contracts/ResponseEnvelope";
import { AssemblyData } from "../contracts/AssemblyData";
import { OperationsChart } from "./tools/OperationsChart/OperationsChart";
import { AssemblyContext } from "./contexts/AssemblyContext";

type ResponseData = ResponseEnvelope<AssemblyData>;

type ErrorData = {
    //
};

type TypedAxiosContext = AxiosContext<ResponseData, ErrorData>;

export type Props = {
    //
};

type State = {
    text: string;
    code: string | null;
};

export class Decompiler extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: "",
            code: null,
        };
    }

    public render() {
        return (
            <Axios
                request={axios => axios.post("http://localhost:5000/api/DebugAnalyse", { code: this.state.code })}
                initCall={false}
            >
                {context => <>
                    {this.renderForm(context)}
                    {this.renderContent(context)}
                </>}
            </Axios>
        );
    }

    private renderForm = (context: TypedAxiosContext) => {
        const isDisabled = context.status === AxiosStatus.Loading;

        return (
            <form onSubmit={e => this.onSubmitted(e, context)}>
                <textarea onChange={this.onTextChanged} value={this.state.text}/>
                <input type="submit" disabled={isDisabled} value="Decompile"/>
            </form>
        );
    }

    private renderContent = (context: TypedAxiosContext) => {
        switch (context.status) {
            case AxiosStatus.NotCalled:
                return this.renderNotCalled();
            case AxiosStatus.Loading:
                return this.renderLoading();
            case AxiosStatus.Success:
                return this.renderSuccess(context.data.data);
            case AxiosStatus.Error:
                return this.renderError(context.error);
        }
    }

    private renderNotCalled = () => {
        return <div>Ready.</div>;
    }

    private renderLoading = () => {
        return <div>Loading...</div>;
    }

    private renderSuccess = (data: ResponseData) => {
        return (
            <AssemblyContext.Provider data={data.value}>
                <AssemblyContext.Consumer>
                    {context => <>
                        <Assembly context={context} />
                        <OperationsChart context={context}/>
                    </>}
                </AssemblyContext.Consumer>
            </AssemblyContext.Provider>
        );
    }

    private renderError = (error: ErrorData) => {
        return <div>Error! `{JSON.stringify(error)}`.</div>;
    }

    private onTextChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            text: event.currentTarget.value,
        });
    }

    private onSubmitted = (event: React.SyntheticEvent, context: TypedAxiosContext) => {
        event.preventDefault();

        this.setState({
            code: this.state.text,
        }, context.call);
    }
}
