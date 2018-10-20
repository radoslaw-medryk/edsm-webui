import * as React from "react";
import { curry } from "@radoslaw-medryk/react-curry";

// TODO [RM]: TEMP place for EXPERIMENTS with PubSubContext

type TopicCalbacks = {
    [topic: string]: Array<{
        consumerId: number,
        f: () => void,
    }>;
};

// TODO [RM]: all structure may not be optimal; PoC only, to be optimized later.
type PubSubInternalContextData = {
    data: PubSubContextData;
    topicCallbacks: TopicCalbacks;
};

export type PubSubContextData = {
    selectedId: string | null;
};

type CalculateChangedTopics = (prev: PubSubContextData, next: PubSubContextData) => string[];
const calculateChangedTopics: CalculateChangedTopics = (prev, next) => {
    if (prev.selectedId === next.selectedId) {
        return [];
    }

    // TODO [RM]: not the most performant, PoC only.
    return ([prev.selectedId, next.selectedId]
        .filter(v => v !== null && v !== undefined)
        .filter((v, i, a) => a.indexOf(v) === i)) as string[]; // only distinct
};

// CalculateChangedBits returning 0 will prevent Consumers observing
// any bits from rerendering. We use this to prevent default rerender behavior,
// implementing our own rerender logic based on topics instead.
const calculateChangedBits = () => 0;
const Context = React.createContext<PubSubInternalContextData>({
    data: {
        selectedId: null,
    },
    topicCallbacks: {},
}, calculateChangedBits);

type ProviderProps = {
    value: PubSubContextData;
};

type ProviderState = PubSubInternalContextData;

class Provider extends React.Component<ProviderProps, ProviderState> {
    constructor(props: ProviderProps) {
        super(props);

        this.state = {
            data: props.value,
            topicCallbacks: {},
        };
    }

    public componentDidUpdate(prevProps: ProviderProps) {
        if (prevProps.value === this.props.value) {
            return;
        }

        this.setState({
            data: this.props.value,
        }, () => {
            // TODO [RM]: check if this callback is called AFTER or BEFORE render
            // TODO [RM]: caused by changed state.

            const changedTopics = calculateChangedTopics(prevProps.value, this.props.value);
            console.log(`[Provider]: changedTopics `, changedTopics);

            for (const topic of changedTopics) {
                const callbacks = this.state.topicCallbacks[topic];
                console.log(`[Provider]: topicCallbacks[${topic}] `, callbacks);

                if (!callbacks) {
                    continue;
                }

                for (const callback of callbacks) {
                    console.log(`[Provider]: callback.f() for consumerId = '${callback.consumerId}'.`);
                    callback.f();
                }
            }
        });
    }

    public render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

export type ConsumerProps = {
    topics: string[];
    children: (context: PubSubContextData) => React.ReactNode;
};

type ConsumerInnerProps = {
    context: PubSubInternalContextData;
} & ConsumerProps;

type ConsumerInnerState = {
    renderId: number;
};

// tslint:disable-next-line:max-classes-per-file
class Consumer extends React.PureComponent<ConsumerProps, {}> {
    constructor(props: ConsumerProps) {
        super(props);
    }

    public render() {
        const { topics, children } = this.props;

        return (
            <Context.Consumer unstable_observedBits={1}>
                {this.renderInner(topics, children)}
            </Context.Consumer>
        );
    }

    private renderInner = curry(
        (topics: string[], children: (context: PubSubContextData) => React.ReactNode) =>
        (context: PubSubInternalContextData) => {

        return <ConsumerInner context={context} topics={topics} children={children} />;
    });
}

// tslint:disable-next-line:max-classes-per-file
class ConsumerInner extends React.PureComponent<ConsumerInnerProps, ConsumerInnerState> {
    private static nextId: number = 0;

    private consumerId: number;

    constructor(props: ConsumerInnerProps) {
        super(props);

        this.consumerId = ConsumerInner.nextId++;

        this.state = {
            renderId: 0,
        };
    }

    public componentDidMount() {
        const { context, topics } = this.props;

        for (const topic of topics) {
            const callbacks = context.topicCallbacks[topic] || [];
            context.topicCallbacks[topic] = [
                ...callbacks,
                {
                    consumerId: this.consumerId,
                    f: this.requestRender,
                },
            ];
            console.log(`[${this.consumerId}]: context.topicCallbacks[${topic}] `, context.topicCallbacks[topic]);
        }
    }

    public componentDidUpdate(prevProps: ConsumerInnerProps) {
        console.log(
            "prevProps.children === this.props.children", prevProps.children === this.props.children,
            "prevProps.context === this.props.context", prevProps.context === this.props.context,
            "prevProps.topics === this.props.topics", prevProps.topics === this.props.topics
        );
    }

    public componentWillUnmount() {
        const { context, topics } = this.props;

        for (const topic of topics) {
            const callbacks = context.topicCallbacks[topic];
            context.topicCallbacks[topic] = callbacks
                .filter(q => q.consumerId !== this.consumerId);
        }
    }

    public render() {
        const { children } = this.props;
        console.log(`[${this.consumerId}]: render();`);

        return (
            <Context.Consumer unstable_observedBits={1}>
                {this.renderChildren(children)}
            </Context.Consumer>
        );
    }

    private renderChildren = curry(
        (children: (context: PubSubContextData) => React.ReactNode) =>
        (context: PubSubInternalContextData) => {
            return children(context.data);
        }
    );

    private requestRender = () => {
        console.log(`[${this.consumerId}]: requestRender();`);
        this.setState(state => ({ renderId: state.renderId + 1}));
    }
}

export const PubSubContext = {
    Consumer: Consumer,
    Provider: Provider,
};
