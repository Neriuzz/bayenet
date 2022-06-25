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

export interface IWorldState {
    nodes: INodeState[];
    edges: IEdgeState[];
}

export default class State {
    public static saveCurrentWorldState(world: World) {
        // Save current world state as JSON
        localStorage.setItem("worldState", JSON.stringify(this.getCurrentStateFromWorld(world)));
    }

    public static loadPreviousWorldState(world: World) {
        // Retrieve previous state from localStroage
        const previousState = localStorage.getItem("worldState");

        // If there is none, exit
        if (!previousState) return;

        // Load the state into the world
        this.loadStateIntoWorld(world, JSON.parse(previousState));

        // Have to sleep here to wait for the network information component to mount
        (async () => {
            await sleep(100);
            eventBus.emit("stateLoaded");
        })();
    }

    private static getCurrentStateFromWorld(world: World): IWorldState {
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

    private static loadStateIntoWorld(world: World, state: IWorldState) {
        // Generate nodes
        state.nodes
            .map((node) => this.nodeFromState(node))
            .forEach((node) => {
                world.addEntity(node);
                world.bayesianNetwork.addNode(node.id.toString(), node.data);
            });

        // Generate edges
        state.edges
            .map((edge) => this.edgeFromState(world.nodes, edge))
            .forEach((edge) => edge && world.addEntity(edge));
    }

    private static nodeFromState(state: INodeState) {
        // Create a new node
        const node = new Node(state.id, state.position, 30);

        // Setup node attributes accordingly
        node.name = state.name;
        node.data = JSON.parse(state.data);
        node.zIndex = state.zIndex;

        return node;
    }

    private static edgeFromState(nodes: Node[], state: IEdgeState) {
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
