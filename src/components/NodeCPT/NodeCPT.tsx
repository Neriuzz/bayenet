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
    parents: string[];
    states: string[];
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPT = ({ cpt, hasParents, parents, states, updateCPT }: NodeCPTProps) => {
    return (
        <div className="node-cpt">
            {hasParents ? (
                <NodeCPTWithParents
                    cpt={cpt as ICptWithParents}
                    parents={parents}
                    states={states}
                    updateCPT={updateCPT}
                />
            ) : (
                <NodeCPTWithoutParents cpt={cpt as ICptWithoutParents} updateCPT={updateCPT} />
            )}
        </div>
    );
};

export default NodeCPT;
