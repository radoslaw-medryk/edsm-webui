import * as React from "react";
import { Axios, AxiosContext, AxiosStatus } from "@radoslaw-medryk/react-axios";
import { Assembly } from "./Assembly";
import { ResponseEnvelope } from "../contracts/ResponseEnvelope";
import { AssemblyData } from "../contracts/AssemblyData";
import { OperationsChart } from "./tools/OperationsChart/OperationsChart";
import { ConfigContext } from "./contexts/ConfigContext";
import { curry } from "@radoslaw-medryk/react-curry";

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

// TODO [RM]: split into smaller components (DecompilerForm, ...)
export class Decompiler extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: "60036002016005146018576000ff63deadbeef63badc0ffe5b",
            code: null,
        };
    }

    public render() {
        return (
            <ConfigContext.Consumer>
                {config => (
                    <Axios
                        // TODO [RM]: pass single func instance to Axios? Change axios?
                        // tslint:disable-next-line:jsx-no-lambda
                        request={axios => axios.post(
                            "/DebugAnalyse",
                            { code: this.state.code },
                            { baseURL: config.api.baseUrl })}
                        initCall={false}
                    >
                        {context => <>
                            {this.renderForm(context)}
                            {this.renderContent(context)}
                        </>}
                    </Axios>
                )}
            </ConfigContext.Consumer>
        );
    }

    private renderForm = (context: TypedAxiosContext) => {
        const isDisabled = context.status === AxiosStatus.Loading;

        return (
            <form onSubmit={this.onSubmitted(context)}>
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
            <>
                <Assembly data={data.value}/>
                <OperationsChart/>
            </>
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

    private onSubmitted = curry((context: TypedAxiosContext) => (event: React.SyntheticEvent) => {
        event.preventDefault();

        this.setState({
            code: this.state.text,
        }, context.call);
    });
}
