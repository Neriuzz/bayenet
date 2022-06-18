import { useReducer } from "react";

// Styling
import "./NodeInformation.scss";

// Components
import NodeName from "../NodeName/NodeName";
import NodeStates from "../NodeStates/NodeStates";
import NodeCPT from "../NodeCPT/NodeCPT";

// Node entity
import Node from "../../renderer/entities/Node";

// Types
import { ICptWithoutParents } from "bayesjs";

// Component prop types
export interface NodeInformationProps {
    node: Node;
}

const NodeInformation = ({ node }: NodeInformationProps) => {
    const [, forceRender] = useReducer((s) => s + 1, 0);

    const updateName = (newName: string) => {
        node.name = newName;
    };

    const addState = (name: string) => {
        node.data.states.push(name);
        node.data.stateProbabilities[name] = 0.0;

        if (node.data.hasParents()) {
            return;
        }

        // Node does not have parents
        (node.data.cpt as ICptWithoutParents)[name] = 0.0;

        // Rerender the component forcefully, so CPTs are updated
        forceRender();
    };

    return (
        <div className="node-information">
            <NodeName name={node.name} updateName={updateName} />
            <p className="node-information-tooltip">States</p>
            <NodeStates
                states={node.data.states}
                stateProbabilities={node.data.stateProbabilities}
                addState={addState}
            />
            <p className="node-information-tooltip">Conditional Probability Table</p>
            <NodeCPT cpt={node.data.cpt} hasParents={node.data.hasParents()} />
        </div>
    );
};

export default NodeInformation;
