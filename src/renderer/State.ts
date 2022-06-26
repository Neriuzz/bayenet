/**
 * Module to faciliate saving of the Bayesian network
 * @author Nerius Ilmonas
 */

// Entities
import Edge from "./entities/Edge";
import Node from "./entities/Node";

// World
import World from "./World";

// Utilities
import { sleep } from "./util/General";
import Vector2D from "./util/Vector2D";

// Event Bus singleton
import EventBus from "../shared/EventBus";
const eventBus = EventBus.instance;

// Interfaces
export interface INodeState {
    id: number;
    zIndex: number;
    position: Vector2D;
    data: string;
    name: string;
}

export interface IEdgeState {
    id: number;
    zIndex: number;
    from: number;
    to: number;
}

export interface ISavedNetwork {
    nodes: INodeState[];
    edges: IEdgeState[];
}

export default class State {
    public static saveCurrentNetwork(world: World) {
        // Save current world network as JSON
        localStorage.setItem("network", JSON.stringify(this.getCurrentNetwork(world)));
    }

    public static loadNetworkFromFile(network: ISavedNetwork, world: World) {
        // Remove all entities from the world
        world.entities.forEach((entity) => world.removeEntity(entity));

        // Load in new network
        this.loadNetwork(network, world);

        // Set local storage
        localStorage.setItem("network", JSON.stringify(network));

        // Let frontend know network has been loaded
        (async () => {
            await sleep(100);
            eventBus.emit("networkLoaded");
        })();
    }

    public static loadNetworkFromLocalStorage(world: World) {
        // Retrieve previous network from localStroage
        const previousNetwork = localStorage.getItem("network");

        // If there is none, exit
        if (!previousNetwork) return;

        // Load the network into the world
        this.loadNetwork(JSON.parse(previousNetwork), world);

        // Have to sleep here to wait for the network information component to mount
        (async () => {
            await sleep(100);
            eventBus.emit("networkLoaded");
        })();
    }

    private static getCurrentNetwork(world: World): ISavedNetwork {
        // Get all required data from all the nodes in the world
        const nodes: INodeState[] = world.nodes.map((node) => {
            return {
                id: node.id,
                zIndex: node.zIndex,
                position: node.position,
                data: JSON.stringify(node.data),
                name: node.name
            };
        });

        // Get all required data from edges in the world
        const edges: IEdgeState[] = world.edges.map((edge) => {
            return { id: edge.id, zIndex: edge.zIndex, from: edge.from.id, to: edge.to?.id || -1 };
        });

        return { nodes, edges };
    }

    private static loadNetwork(network: ISavedNetwork, world: World) {
        // Generate nodes
        network.nodes
            .map((node) => this.nodeFromPrevious(node))
            .forEach((node) => {
                world.addEntity(node);
                world.bayesianNetwork.addNode(node.id.toString(), node.data);
            });

        // Generate edges
        network.edges
            .map((edge) => this.edgeFromPrevious(world.nodes, edge))
            .forEach((edge) => edge && world.addEntity(edge));
    }

    private static nodeFromPrevious(state: INodeState) {
        // Create a new node
        const node = new Node(state.id, state.position, 30);

        // Setup node attributes accordingly
        node.name = state.name;
        node.data = JSON.parse(state.data);
        node.zIndex = state.zIndex;

        return node;
    }

    private static edgeFromPrevious(nodes: Node[], state: IEdgeState) {
        // If has no "to" node, do not process
        if (state.to == -1) return;

        // Retrieve from and to nodes via their ids
        const fromNode = nodes.find((node) => node.id === state.from);
        const toNode = nodes.find((node) => node.id === state.to);

        // If they cannot be retrieve, exit
        if (!fromNode || !toNode) return;

        // Create the edge
        const edge = new Edge(state.id, 10, fromNode, new Vector2D(0, 0), toNode);

        // Add the edge to the nodes
        fromNode.edges.push(edge);
        toNode.edges.push(edge);

        return edge;
    }
}
