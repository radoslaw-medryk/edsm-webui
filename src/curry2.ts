type Nodex = {
    f: any | null,
    map: Map<any, Nodex>;
};

function getFunc(memory: Map<any, Nodex>, defCurry: any, ...args: any[]): any {
    let previous: Map<any, Nodex> = memory;
    let f: any | null = null;

    args.forEach((v, i) => {
        let current = previous.get(v);
        if (!current) {
            current = { f: null, map: new Map<any, Nodex>() };
            previous.set(v, current);
        }

        const isLast = i === args.length - 1;
        if (isLast) {
            if (!current.f) {
                current.f = defCurry;
            }
            f = current.f;
        }

        previous = current.map;
    });

    if (!f) {
        throw new Error("f === null");
    }

    return f;
}

/*export type Func<TOut> = () => TOut;
export type Func1<TOut, T1> = (a1: T1) => TOut;*/
export type Func2<TOut, T1, T2> = (a1: T1, a2: T2) => TOut;
export type Func3<TOut, T1, T2, T3> = (a1: T1, a2: T2, a3: T3) => TOut;

export type FuncUnion<TOut, T1, T2, T3> = /*Func<TOut>
    | Func1<TOut, T1>
    | */Func2<TOut, T1, T2>
    | Func3<TOut, T1, T2, T3>;

/*export type CurryFunction<TOut> = () => () => TOut;
export type CurryFunction1<TOut, T1> = () => (a1: T1) => TOut;*/
export type CurryFunction2<TOut, T1, T2> = (a2: T2) => (a1: T1) => TOut;
export type CurryFunction3<TOut, T1, T2, T3> = (a2: T2, a3: T3) => (a1: T1) => TOut;
export type CurryFunctionUnion<TOut, T1, T2, T3> = /*CurryFunction<TOut>
    | CurryFunction1<TOut, T1>
    | */CurryFunction2<TOut, T1, T2>
    | CurryFunction3<TOut, T1, T2, T3>;

/*function isFunc<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func<TOut> {
    return func.length === 0;
}

function isFunc1<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func1<TOut, T1> {
    return func.length === 1;
}*/

function isFunc2<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func2<TOut, T1, T2> {
    return func.length === 2;
}

function isFunc3<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>): func is Func3<TOut, T1, T2, T3> {
    return func.length === 3;
}

// function curry<TOut>(func: Func<TOut>): CurryFunction<TOut>;
// function curry<TOut, T1>(func1: Func1<TOut, T1>): CurryFunction1<TOut, T1>;
export function curry<TOut, T1, T2>(func2: Func2<TOut, T1, T2>): CurryFunction2<TOut, T1, T2>;
export function curry<TOut, T1, T2, T3>(func3: Func3<TOut, T1, T2, T3>): CurryFunction3<TOut, T1, T2, T3>;

export function curry<TOut, T1, T2, T3>(func: FuncUnion<TOut, T1, T2, T3>) {
    const memory = new Map<any, Nodex>();

    /*if (isFunc(func)) {
        return getFunc(memory, () => () => func(), 0);
    } else if (isFunc1(func)) {
        return () => (a1: T1) => func(a1);
    } else */
    if (isFunc2(func)) {
        return (a2: T2) => getFunc(memory, (a1: T1) => func(a1, a2), a2);
    } else {
        return (a2: T2, a3: T3) => getFunc(memory, (a1: T1) => func(a1, a2, a3), a2, a3);
    }
}

const x2 = curry((e: Event, a2: string) => {
    return true;
});

const x3 = curry((e: Event, a2: string, a3: number) => {
    return true;
});

const w2 = x2("hey");
const w3 = x3("hey hey hey!", 12);
//

//

//

//

// export const curry: <TOut, T1, T2>(func: Func<TOut, T1, T2>) => CurryFunction<T1>
//     = <TOut, T1, T2>(func: Func<TOut, T1, T2>) => {
//     const state = new Map<any, Node>();
//     const r = (...args: any[]) => {
//         let previous: Map<any, Node> = state;

//         let f: ((...args: any[]) => void) | null = null;
//         args.forEach((v, i) => {
//             let current = previous.get(v);
//             if (!current) {
//                 current = { f: null, map: new Map<any, Node>() };
//                 previous.set(v, current);
//             }

//             const isLast = i === args.length - 1;
//             if (isLast) {
//                 if (!current.f) {
//                     current.f = (e: T) => func(e, ...args);
//                 }
//                 f = current.f;
//             }

//             previous = current.map;
//         });

//         if (!f) {
//             throw new Error("No args given.");
//         }

//         return f;
//     };

//     return r;

// };

// export {};

// declare global {
//     interface Function {
//         curry: <T>() => CurryFunction<T>;
//     }
// }

// type CurryFunction<T> = (...args: any[]) => (a: T) => void;

// type Node = {
//     f: ((...args: any[]) => void) | null;
//     map: Map<any, Node>;
// };

// // tslint:disable-next-line:only-arrow-functions
// Function.prototype.curry = function<T>(): CurryFunction<T> {

//     // TODO [RM]: continue tomorrow;
//     // {
//     //     "test": { f: () => {...}, map: {
//     //         "smth": { f: () => {...}, map: {}}
//     //     }}
//     // }

//     const state = new Map<any, Node>();
//     const r = (...args: any[]) => {
//         let previous: Map<any, Node> = state;

//         let f: ((...args: any[]) => void) | null = null;
//         args.forEach((v, i) => {
//             let current = previous.get(v);
//             if (!current) {
//                 current = { f: null, map: new Map<any, Node>() };
//                 previous.set(v, current);
//             }

//             const isLast = i === args.length - 1;
//             if (isLast) {
//                 if (!current.f) {
//                     current.f = (e: T) => this(e, ...args);
//                 }
//                 f = current.f;
//             }

//             previous = current.map;
//         });

//         if (!f) {
//             throw new Error("No args given.");
//         }

//         return f;
//     };

//     return r;
// };

// export class Test {
//     private handleX: CurryFunction<Event>;

//     constructor() {
//         this.handleX = this.handle.curry();
//     }

//     public render() {
//         const onClick: (e: Event) => void = this.handleX("lol", 1337);
//     }

//     private handle(e: Event, pa: string, pb: number) {
//         console.log(e, pa, pb);
//     }
// }
