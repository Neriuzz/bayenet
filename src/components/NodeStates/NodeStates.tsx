import { StateProbabilities } from "../../shared/DataModels/bayesian-node";

// For probability bar colours
import ColorHash from "color-hash";

// Styles
import "./NodeStates.scss";
export interface NodeStatesProps {
    states: string[];
    stateProbabilities: StateProbabilities;
}

const NodeStates = ({ states, stateProbabilities }: NodeStatesProps) => {
    const colourHash = new ColorHash();

    return (
        <div className="node-states">
            {states.map((state, index) => (
                <div key={index} className="node-state">
                    <p className="state-name" title={state}>
                        {state}
                    </p>
                    <div
                        className="state-probability-bar"
                        style={{
                            width: `${Math.floor(stateProbabilities[state] * 100)}%`,
                            backgroundColor: colourHash.hex(state)
                        }}
                    ></div>
                    <p className="state-probability">{`${Math.floor(stateProbabilities[state] * 100)}%`}</p>
                </div>
            ))}
        </div>
    );
};

export default NodeStates;
