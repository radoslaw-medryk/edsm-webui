type Nodex = {
    f: any | null,
    map: Map<any, Nodex>;
};

function simpleCurry<TOut>(func: Func<TOut>)
    : CurryFunction<TOut>;
function simpleCurry<TOut, T1>(func: Func1<TOut, T1>)
    : CurryFunction1<TOut, T1>;
function simpleCurry<TOut, T1, T2>(func: Func2<TOut, T1, T2>, a2: T2)
    : CurryFunction2<TOut, T1, T2>;
function simpleCurry<TOut, T1, T2, T3>(func: Func3<TOut, T1, T2, T3>, a2: T2, a3: T3)
    : CurryFunction3<TOut, T1, T2, T3>;
function simpleCurry<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>, a2?: T2, a3?: T3) {
    if (isFunc(func)) {
        return () => func();
    } else if (isFunc1(func)) {
        return (a1: T1) => func(a1);
    } else if (isFunc2(func)) {
        if (!a2) {
            throw new Error("!a2");
        }
        return (a1: T1) => func(a1, a2);
    } else {
        if (!a2 || !a3) {
            throw new Error("!a2 || !a3");
        }
        return (a1: T1) => func(a1, a2, a3);
    }
}

function getFunc<TOut>(memory: Map<any, Nodex>, func: Func<TOut>)
    : CurryFunction<TOut>;
function getFunc<TOut, T1>(memory: Map<any, Nodex>, func: Func1<TOut, T1>)
    : CurryFunction1<TOut, T1>;
function getFunc<TOut, T1, T2>(memory: Map<any, Nodex>, func: Func2<TOut, T1, T2>, a2: T2)
    : CurryFunction2<TOut, T1, T2>;
function getFunc<TOut, T1, T2, T3>(memory: Map<any, Nodex>, func: Func3<TOut, T1, T2, T3>, a2: T2, a3: T3)
    : CurryFunction3<TOut, T1, T2, T3>;
function getFunc<TOut, T1, T2, T3>(memory: Map<any, Nodex>, func: FuncUnion<TOut, T1, T2, T3>, a2: T2, a3?: T3) {
    let args: Array<T2 | T3 | undefined> | null = null;

    if (isFunc(func)) {
        // TODO [RM]: cannot just return, must store in memory so every time returns the same instance
        return simpleCurry(func);
    } else if (isFunc1(func)) {
        // TODO [RM]: cannot just return, must store in memory so every time returns the same instance
        return simpleCurry(func);
    }

    // tslint:disable-next-line:prefer-conditional-expression
    if (isFunc2(func)) {
        args = [a2];
    } else if (isFunc3(func)) {
        args = [a2, a3];
    }

    if (!args) {
        throw new Error("!args");
    }

    let previous: Map<any, Nodex> = memory;

    for (let i = 0; i < args.length; i++) {
        const v = args[i];

        let current = previous.get(v);
        if (!current) {
            current = { f: null, map: new Map<any, Nodex>() };
            previous.set(v, current);
        }

        const isLast = i === args.length - 1;
        if (isLast) {
            if (!current.f) {
                // tslint:disable-next-line:prefer-conditional-expression
                if (isFunc2(func)) {
                    current.f = simpleCurry(func, a2);
                } else if (isFunc3(func)) {
                    current.f = simpleCurry(func, a2, a3);
                }
            }

            return current.f;
        }

        previous = current.map;
    }

    throw new Error("Returned nothing.");
}

export type Func<TOut> = () => TOut;
export type Func1<TOut, T1> = (a1: T1) => TOut;
export type Func2<TOut, T1, T2> = (a1: T1, a2: T2) => TOut;
export type Func3<TOut, T1, T2, T3> = (a1: T1, a2: T2, a3: T3) => TOut;

export type FuncUnion<TOut, T1, T2, T3> = Func<TOut>
    | Func1<TOut, T1>
    | Func2<TOut, T1, T2>
    | Func3<TOut, T1, T2, T3>;

export type CurryFunction<TOut> = () => () => TOut;
export type CurryFunction1<TOut, T1> = () => (a1: T1) => TOut;
export type CurryFunction2<TOut, T1, T2> = (a2: T2) => (a1: T1) => TOut;
export type CurryFunction3<TOut, T1, T2, T3> = (a2: T2, a3: T3) => (a1: T1) => TOut;
export type CurryFunctionUnion<TOut, T1, T2, T3> = CurryFunction<TOut>
    | CurryFunction1<TOut, T1>
    | CurryFunction2<TOut, T1, T2>
    | CurryFunction3<TOut, T1, T2, T3>;

function isFunc<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func<TOut> {
    return func.length === 0;
}

function isFunc1<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func1<TOut, T1> {
    return func.length === 1;
}

function isFunc2<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func2<TOut, T1, T2> {
    return func.length === 2;
}

function isFunc3<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func3<TOut, T1, T2, T3> {
    return func.length === 3;
}

export function curry<TOut>(func: Func<TOut>): CurryFunction<TOut>;
export function curry<TOut, T1>(func1: Func1<TOut, T1>): CurryFunction1<TOut, T1>;
export function curry<TOut, T1, T2>(func2: Func2<TOut, T1, T2>): CurryFunction2<TOut, T1, T2>;
export function curry<TOut, T1, T2, T3>(func3: Func3<TOut, T1, T2, T3>): CurryFunction3<TOut, T1, T2, T3>;
export function curry<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>) {
    const memory = new Map<any, Nodex>();

    if (isFunc(func)) {
        return () => getFunc(memory, func);
    } else if (isFunc1(func)) {
        return () => getFunc(memory, func);
    } else  if (isFunc2(func)) {
        return (a2: T2) => getFunc(memory, func, a2);
    } else {
        return (a2: T2, a3: T3) => getFunc(memory, func, a2, a3);
    }
}

const x0 = curry(() => {
    return true;
});

const x1 = curry((a: number) => {
    return true;
});

const x2 = curry((e: Event, a2: string) => {
    return true;
});

const x3 = curry((e: Event, a2: string, a3: number) => {
    return true;
});

const w0 = x0();
const w1 = x1();
const w2 = x2("hey");
const w3 = x3("hey hey hey!", 12);
