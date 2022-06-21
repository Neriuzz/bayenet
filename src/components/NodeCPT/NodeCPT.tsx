// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Components
import NodeCPTWithoutParents from "../NodeCPTWithoutParents/NodeCPTWithoutParents";
import NodeCPTWithParents from "../NodeCPTWithParents/NodeCPTWithParents";

// Styles
import "./NodeCPT.scss";

// Component props
export interface NodeCPTProps {
    id: number;
    cpt: ICptWithParents | ICptWithoutParents;
    hasParents: boolean;
    parents: string[];
    states: string[];
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPT = ({ id, cpt, hasParents, parents, states, updateCPT }: NodeCPTProps) => {
    return (
        <div key={id} className="node-cpt">
            {hasParents ? (
                <NodeCPTWithParents
                    cpt={cpt as ICptWithParents}
                    parents={parents}
                    states={states}
                    updateCPT={updateCPT}
                />
            ) : (
                <NodeCPTWithoutParents states={states} cpt={cpt as ICptWithoutParents} updateCPT={updateCPT} />
            )}
        </div>
    );
};

export default NodeCPT;
