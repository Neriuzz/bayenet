// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Components
import NodeCPTWithoutParents from "../NodeCPTWithoutParents/NodeCPTWithoutParents";
import NodeCPTWithParents from "../NodeCPTWithParents/NodeCPTWithParents";

// Styles
import "./NodeCPT.scss";

// Component props
export interface NodeCPTProps {
    cpt: ICptWithParents | ICptWithoutParents;
    hasParents: boolean;
}

const NodeCPT = ({ cpt, hasParents }: NodeCPTProps) => {
    return (
        <div className="node-cpt">
            {hasParents ? (
                <NodeCPTWithParents cpt={cpt as ICptWithParents} />
            ) : (
                <NodeCPTWithoutParents cpt={cpt as ICptWithoutParents} />
            )}
        </div>
    );
};

export default NodeCPT;
