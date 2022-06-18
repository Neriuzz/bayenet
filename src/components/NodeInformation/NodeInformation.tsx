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

    const addState = (state: string) => {
        // Add new state to node states and set initial probability to 0
        node.data.states.push(state);
        node.data.probabilities[state] = 0.0;

        if (node.hasParents()) {
            //
        } else {
            // Node does not have parents
            (node.data.cpt as ICptWithoutParents)[state] = 0.0;
        }

        // Rerender the component forcefully, so CPTs are updated
        forceRender();
    };

    const removeState = (index: number) => {
        // Retrieve state via index
        const state = node.data.states[index];

        // Remove state from node states and state probabilities
        node.data.states.splice(index, 1);
        delete node.data.probabilities[state];

        if (node.hasParents()) {
            //
        } else {
            delete (node.data.cpt as ICptWithoutParents)[state];
        }

        // Rerender the component, so states are updated
        forceRender();
    };

    return (
        <div className="node-information">
            <NodeName name={node.name} updateName={updateName} />
            <p className="node-information-tooltip">States</p>
            <NodeStates
                states={node.data.states}
                stateProbabilities={node.data.probabilities}
                addState={addState}
                removeState={removeState}
            />
            <p className="node-information-tooltip">Conditional Probability Table</p>
            <NodeCPT cpt={node.data.cpt} hasParents={node.hasParents()} />
        </div>
    );
};

export default NodeInformation;
