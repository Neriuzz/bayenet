import BayesianNetwork, { INodeData } from "../../../src/shared/compute/bayesian-network";
import EventBus, { NetworkEvent } from "../../../src/shared/EventBus";

const eventBus = EventBus.instance;

describe("bayesianNetwork", () => {
    let bayesianNetwork: BayesianNetwork;

    beforeEach(() => {
        bayesianNetwork = new BayesianNetwork();
    });

    test("correctly infers node state probabilities for nodes without parents", () => {
        const node1: INodeData = {
            id: "1",
            name: "Node 1",
            parents: [],
            states: ["True", "False"],
            probabilities: { True: 0.5, False: 0.5 },
            cpt: { True: 0.75, False: 0.25 }
        };

        bayesianNetwork.addNode("1", node1);

        eventBus.emit(NetworkEvent.INFER_ALL);
        expect(node1.probabilities).toStrictEqual({ True: 0.75, False: 0.25 });
    });

    test("correctly infers node state probabilities for nodes with parents", () => {
        const node1: INodeData = {
            id: "1",
            name: "Node 1",
            parents: [],
            states: ["True", "False"],
            probabilities: {},
            cpt: { True: 0.5, False: 0.5 }
        };

        const node2: INodeData = {
            id: "2",
            name: "Node 2",
            parents: [],
            states: ["True", "False"],
            probabilities: {},
            cpt: { True: 0.5, False: 0.5 }
        };

        const node3: INodeData = {
            id: "3",
            name: "Node 3",
            parents: ["1", "2"],
            states: ["True", "False"],
            probabilities: {},
            cpt: [
                {
                    when: { "1": "True", "2": "True" },
                    then: { True: 0.5, False: 0.5 }
                },
                {
                    when: { "1": "False", "2": "True" },
                    then: { True: 0.5, False: 0.5 }
                },
                {
                    when: { "1": "True", "2": "False" },
                    then: { True: 0.5, False: 0.5 }
                },
                {
                    when: { "1": "False", "2": "False" },
                    then: { True: 0.5, False: 0.5 }
                }
            ]
        };

        bayesianNetwork.addNode("1", node1);
        bayesianNetwork.addNode("2", node2);
        bayesianNetwork.addNode("3", node3);

        eventBus.emit(NetworkEvent.INFER_ALL);
        expect(node1.probabilities).toStrictEqual({ True: 0.5, False: 0.5 });
        expect(node2.probabilities).toStrictEqual({ True: 0.5, False: 0.5 });
        expect(node3.probabilities).toStrictEqual({ True: 0.5, False: 0.5 });
    });

    test("correctly infers with evidence", () => {
        const node1: INodeData = {
            id: "1",
            name: "Node 1",
            parents: [],
            states: ["True", "False"],
            probabilities: {},
            cpt: { True: 0.5, False: 0.5 }
        };

        const node2: INodeData = {
            id: "2",
            name: "Node 2",
            parents: [],
            states: ["True", "False"],
            probabilities: {},
            cpt: { True: 0.5, False: 0.5 }
        };

        const node3: INodeData = {
            id: "3",
            name: "Node 3",
            parents: ["1", "2"],
            states: ["True", "False"],
            probabilities: {},
            cpt: [
                {
                    when: { "1": "True", "2": "True" },
                    then: { True: 0.9, False: 0.1 }
                },
                {
                    when: { "1": "False", "2": "True" },
                    then: { True: 0.5, False: 0.5 }
                },
                {
                    when: { "1": "True", "2": "False" },
                    then: { True: 0.5, False: 0.5 }
                },
                {
                    when: { "1": "False", "2": "False" },
                    then: { True: 0.5, False: 0.5 }
                }
            ]
        };

        bayesianNetwork.addNode("1", node1);
        bayesianNetwork.addNode("2", node2);
        bayesianNetwork.addNode("3", node3);

        eventBus.emit(NetworkEvent.ADD_EVIDENCE, "1", "True");
        eventBus.emit(NetworkEvent.ADD_EVIDENCE, "2", "True");

        eventBus.emit(NetworkEvent.INFER_ALL);

        expect(node3.probabilities).toStrictEqual({ True: 0.9, False: 0.1 });
    });
});

describe("bayesian network", () => {
    const bayesianNetwork = new BayesianNetwork();
    const calculateProbabilities = jest
        .spyOn(bayesianNetwork as any, "calculateProbabilities")
        .mockImplementation(jest.fn());
    const addEvidence = jest.spyOn(bayesianNetwork as any, "addEvidence").mockImplementation(jest.fn());
    const clearEvidence = jest.spyOn(bayesianNetwork as any, "clearEvidence").mockImplementation(jest.fn());

    test("responds to INFER_ALL event", () => {
        eventBus.emit(NetworkEvent.INFER_ALL);

        expect(calculateProbabilities).toHaveBeenCalled();
    });

    test("responds to CLEAR_EVIDENCE event", () => {
        eventBus.emit(NetworkEvent.CLEAR_EVIDENCE);

        expect(clearEvidence).toHaveBeenCalled();
    });

    test("responds to ADD_EVIDENCE event", () => {
        eventBus.emit(NetworkEvent.ADD_EVIDENCE);

        expect(addEvidence).toHaveBeenCalled();
    });
});
