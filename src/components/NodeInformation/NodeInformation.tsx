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

    return (
        <div className="node-information">
            <NodeName name={node.name} updateName={updateName} />
            <p className="node-information-tooltip">States</p>
            <NodeStates states={node.data.states} stateProbabilities={node.data.stateProbabilities} />
            <p className="node-information-tooltip">Conditional Probability Table</p>
            <NodeCPT cpt={node.data.cpt} />
        </div>
    );
};

export default NodeInformation;
