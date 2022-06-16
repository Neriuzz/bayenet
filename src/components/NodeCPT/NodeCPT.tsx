import { ICptWithoutParents, ICptWithParents } from "bayesjs";

export interface NodeCPTProps {
    cpt: ICptWithParents | ICptWithoutParents;
}

const NodeCPT = ({ cpt }: NodeCPTProps) => {
    return null;
};

export default NodeCPT;
