import * as React from "react";

interface Props {
    isLoading: boolean;
}

export const withLoading = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return class extends React.Component<P & Props> {
        render() {
            const { isLoading, ...props } = this.props as Props;

            return isLoading
                ? <div>Loading...</div>
                : <WrappedComponent {...props} />;
        }
    }
};