import * as React from "react";

export enum HttpMethod {
    Unknown = "",
    Get = "GET",
    Post = "POST"
}

interface Props {
    endpoint: string;
    method: HttpMethod;
}

export const withApi = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return class extends React.Component<P & Props> { // TODO [RM]: Learn Higher Order Components + Typescript
        
    }
}