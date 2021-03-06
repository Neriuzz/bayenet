// BayesJS types
import { ICombinations, INetwork, inferAll, INode, INodeResult } from "bayesjs";

// Event bus singleton
import EventBus, { NetworkEvent } from "../EventBus";
const eventBus = EventBus.instance;

// Custom type extending the BayesJS INode
export type INodeData = INode & {
    name: string;
    probabilities: INodeResult;
};

export default class BayesianNetwork {
    private network: INetwork = {};
    private evidence: ICombinations = {};

    constructor() {
        // Register event listeners
        eventBus.on(NetworkEvent.INFER_ALL, () => this.calculateProbabilities());
        eventBus.on(NetworkEvent.ADD_EVIDENCE, (id: string, state: string) => this.addEvidence(id, state));
        eventBus.on(NetworkEvent.CLEAR_EVIDENCE, () => this.clearEvidence());
    }

    public addNode(name: string, node: INode) {
        this.network[name] = node;
    }

    public removeNode(name: string) {
        delete this.network[name];
    }

    private calculateProbabilities() {
        const result = inferAll(this.network, this.evidence, { force: true });
        Object.keys(result).forEach((node) => ((this.network[node] as INodeData).probabilities = result[node]));
    }

    private addEvidence(id: string, state: string) {
        this.evidence[id] = state;
        this.calculateProbabilities();
    }

    private clearEvidence() {
        this.evidence = {};
        this.calculateProbabilities();
    }

    public removeEvidence(id: string) {
        delete this.evidence[id];
        this.calculateProbabilities();
    }
}
