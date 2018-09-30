type Node = {
    f: ((...args: any[]) => void) | null;
    map: Map<any, Node>;
};

type Func<TOut = void, T1 = undefined, T2 = undefined, T3 = undefined>
    = (a1: T1, a2: T2, a3: T3) => TOut;

type CurryFunction<TOut, T1, T2, T3> = (a2: T2, a3: T3) => (a1: T1) => TOut;

export const curry: <TOut = void, T1 = undefined, T2 = undefined, T3= undefined>(func: Func<TOut, T1, T2, T3>)
    => CurryFunction<TOut, T1, T2, T3>
    = <TOut, T1, T2, T3>(func: Func<TOut, T1, T2, T3>) => {
    const r = (a2: T2, a3: T3) => (a1: T1) => func(a1, a2, a3);
    return r;
};

const doSmth = curry((e: Event, id: string, n: number) => true);

const x = doSmth("", 1);

//

//

//

//

type F = (a?: string, b?: undefined) => boolean;
const f: F = (n: number) => true;
f();

type Gf = (a: string, b: null | undefined) => boolean;
const q: Gf = () => true;
const w = q("hi");

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
