import { OperationData } from "./OperationData";
import { Hex } from "../types/Hex";

export interface BranchData {
    position: Hex;
    length: Hex;
    isAccessible: boolean;
    operations: OperationData[];
}
