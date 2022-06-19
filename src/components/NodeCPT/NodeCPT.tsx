// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Components
import NodeCPTWithoutParents from "../NodeCPTWithoutParents/NodeCPTWithoutParents";
import NodeCPTWithParents from "../NodeCPTWithParents/NodeCPTWithParents";

// Styles
import "./NodeCPT.scss";

// Component props
export interface NodeCPTProps {
    key: React.Key;
    cpt: ICptWithParents | ICptWithoutParents;
    hasParents: boolean;
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPT = ({ cpt, hasParents, updateCPT }: NodeCPTProps) => {
    return (
        <div className="node-cpt">
            {hasParents ? (
                <NodeCPTWithParents cpt={cpt as ICptWithParents} />
            ) : (
                <NodeCPTWithoutParents cpt={cpt as ICptWithoutParents} updateCPT={updateCPT} />
            )}
        </div>
    );
};

export default NodeCPT;
