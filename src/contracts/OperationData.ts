import { Hex } from "../types/Hex";

export interface OperationData {
    position: Hex;
    opCode: Hex;
    inCodeInput: Hex | null;
}
