// Styling
import "./NodeInformation.scss";

// Components
import NodeName from "../NodeName/NodeName";

// Node entity
import Node from "../../renderer/entities/Node";
import NodeStates from "../NodeStates/NodeStates";
import NodeCPT from "../NodeCPT/NodeCPT";

export interface NodeInformationProps {
    node: Node;
}

const NodeInformation = ({ node }: NodeInformationProps) => {
    const updateName = (newName: string) => {
        node.name = newName;
    };

    const addState = (name: string) => {
        node.data.states.push(name);
        node.data.stateProbabilities = { ...node.data.stateProbabilities, name: 0.0 };
    };

    return (
        <div className="node-information">
            <NodeName name={node.name} updateName={updateName} />
            <p className="node-information-tooltip">States</p>
            <NodeStates states={node.data.states} stateProbabilities={node.data.stateProbabilities} />
            <p className="node-information-tooltip">Conditional Probability Table</p>
            <NodeCPT cpt={node.data.cpt} hasParents={node.data.parents.length > 0} />
        </div>
    );
};

export default NodeInformation;
