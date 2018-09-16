import * as React from "react";
import { AssemblyData } from "contracts/AssemblyData";
import { Assembly } from "./Assembly";
import { ResponseEnvelope } from "contracts/ResponseEnvelope";

export interface Props {
    code: string;
};

interface State {
    isLoading: boolean;
    isError: boolean;
    isDisposed: boolean;
    data: AssemblyData | null;
};

export class AssemblyContainer extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            isDisposed: false,
            data: null
        };
    }
    
    async componentDidMount() {
        await this.tryFetchData(this.props.code);
    }


    componentWillUnmount() {
        this.setState({ isDisposed: true });
    }

    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        if (this.state.isError || this.state.data === null) {
            return <div>ERROR!</div>;
        }

        return <Assembly data={this.state.data}/>;
    }

    private async tryFetchData(code: string) {
        this.setState({
            isLoading: true
        });

        let isError = false;
        let data: AssemblyData | null = null;

        try {
            data = await this.callApi(code);
        } catch {
            isError = true;
        }

        if (this.state.isDisposed) {
            return;
        }

        this.setState({
            isLoading: false,
            isError: isError,
            data: data
        });
    }

    private async callApi(code: string): Promise<AssemblyData> {
        const response = await window.fetch("http://localhost:5000/api/DebugAnalyse",
        {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                code: code
            })
        });

        if (!response.ok) {
            const bodyText = await response.text(); 
            throw `Response with non-success status code '${response.status} ${response.statusText}', bodyText = '${bodyText}'.`;
        }

        const envelope = await response.json() as ResponseEnvelope<AssemblyData>;
        return envelope.value;
    }
}