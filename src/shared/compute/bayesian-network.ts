import { ICombinations, INetwork, inferAll, INode, INodeResult } from "bayesjs";
import EventBus from "../EventBus";

const eventBus = EventBus.instance;

export type INodeData = INode & {
    probabilities: INodeResult;
};

export default class BayesianNetwork {
    public network: INetwork = {};
    public evidence: ICombinations = {};

    constructor() {
        // Setup event listeners
    }

    public addNode(name: string, node: INode) {
        this.network[name] = node;
    }

    public removeNode(name: string) {
        delete this.network[name];
    }

    public calculateProbabilities() {
        const result = inferAll(this.network, this.evidence, { force: true });
        Object.keys(result).forEach((node) => ((this.network[node] as INodeData).probabilities = result[node]));
    }
}
