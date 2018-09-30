export {};

declare global {
    interface Function {
        curry: <T>() => CurryFunction<T>;
    }
}

type CurryFunction<T> = (...args: any[]) => (a: T) => void;

type Node = {
    f: ((...args: any[]) => void) | null;
    map: Map<any, Node>;
};

// tslint:disable-next-line:only-arrow-functions
Function.prototype.curry = function<T>(): CurryFunction<T> {

    // TODO [RM]: continue tomorrow;
    // {
    //     "test": { f: () => {...}, map: {
    //         "smth": { f: () => {...}, map: {}}
    //     }}
    // }

    const state = new Map<any, Node>();
    const r = (...args: any[]) => {
        let previous: Map<any, Node> = state;

        let f: ((...args: any[]) => void) | null = null;
        args.forEach((v, i) => {
            let current = previous.get(v);
            if (!current) {
                current = { f: null, map: new Map<any, Node>() };
                previous.set(v, current);
            }

            const isLast = i === args.length - 1;
            if (isLast) {
                if (!current.f) {
                    current.f = (e: T) => this(e, ...args);
                }
                f = current.f;
            }

            previous = current.map;
        });

        if (!f) {
            throw new Error("No args given.");
        }

        return f;
    };

    return r;
};

export class Test {
    private handleX: CurryFunction<Event>;

    constructor() {
        this.handleX = this.handle.curry();
    }

    public render() {
        const onClick: (e: Event) => void = this.handleX("lol", 1337);
    }

    private handle(e: Event, pa: string, pb: number) {
        console.log(e, pa, pb);
    }
}
