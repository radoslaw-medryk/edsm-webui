import { OperationData } from "./OperationData";

export interface BranchData {
    position: string;
    length: string;
    operations: OperationData[];
}