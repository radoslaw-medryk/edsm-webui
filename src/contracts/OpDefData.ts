import { Hex } from "../types/Hex";

export type OpDefData = {
    opCode: Hex,
    name: string,
    inCodeInputLength: number,
    stackInputsCount: number,
    stackOutputsCount: number,
    isValid: boolean,
};
