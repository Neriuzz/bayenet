import { StateProbabilities } from "../../shared/DataModels/bayesian-node";

export interface NodeStatesProps {
    states: string[];
    stateProbabilities: StateProbabilities;
}

const NodeStates = ({ states, stateProbabilities }: NodeStatesProps) => {
    return null;
};

export default NodeStates;
