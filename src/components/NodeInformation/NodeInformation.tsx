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
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// EventBus singleton
import EventBus from "../../shared/EventBus";
const eventBus = EventBus.instance;

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

        // If node has children, refresh all of their CPTs
        if (node.hasChildren()) node.children.forEach((child) => child.refreshCPT());

        // Rerender the component so visual changes are displayed
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
            // Get current probability value of the state to delete
            const value = (node.data.cpt as ICptWithoutParents)[state];

            // Remove the state from node cpt
            delete (node.data.cpt as ICptWithoutParents)[state];

            // Split share of probability value from deleted state between remaining states
            const toAdd = value / Object.keys(node.data.cpt).length;
            Object.keys(node.data.cpt).forEach((state) => ((node.data.cpt as ICptWithoutParents)[state] += toAdd));
        }

        // If the node has children, refresh all of their CPTs
        if (node.hasChildren()) node.children.forEach((child) => child.refreshCPT());

        // Infer new state probabilites for entire network
        eventBus.emit("inferAll");

        // Rerender the component so visual changes are displayed
        forceRender();
    };

    const updateCPT = (newCpt: ICptWithParents | ICptWithoutParents) => {
        // Update node cpt
        node.data.cpt = newCpt;

        // Infer new state probabilities for entire network
        eventBus.emit("inferAll");

        // Rerender for visual updates
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
            <NodeCPT
                key={Object.keys(node.data.cpt).length}
                cpt={node.data.cpt}
                hasParents={node.hasParents()}
                updateCPT={updateCPT}
            />
        </div>
    );
};

export default NodeInformation;
