/**
 * @author Nerius Ilmonas
 */

// Entities
import Node from "../entities/Node";

/**
 * @description Extracts the adjacency list from a network of nodes
 *
 *
 * @param nodes List of all nodes in the network
 * @returns Adjaceny list of nodes, denoting the connections between nodes
 */
function extractAdjacencyList(nodes: Node[]) {
    const adj: number[][] = nodes.map(() => []);
    nodes.forEach((node) => {
        node.edges.forEach((edge) => {
            if (edge.to && edge.to.id !== node.id) {
                adj[nodes.indexOf(node)].push(nodes.indexOf(edge.to));
            }
        });
    });
    console.log(adj);
    return adj;
}

/**
 * @description Checks if a cycle can be formed from the current node we are visiting. This is a recursive depth-first search function
 *
 * @param node Current node we are visting
 * @param adj Adjacency list of the network
 * @param visited List of visited nodes
 * @param dfsVisited List of nodes visited by the depth-first search algorithm
 * @returns True if there is a cycle and False if there is no cycle
 */
function checkCycle(node: number, adj: number[][], visited: boolean[], dfsVisited: boolean[]): boolean {
    visited[node] = true;
    dfsVisited[node] = true;
    for (const child of adj[node]) {
        if (!visited[child] && checkCycle(child, adj, visited, dfsVisited)) return true;
        else if (dfsVisited[child]) return true;
    }

    dfsVisited[node] = false;
    return false;
}

/**
 * @description Checks whether the current network contains any cycles within it
 *
 * @param nodes List of all nodes in the network
 * @returns True if the network is cyclic and False if the network is acyclic
 */
export default function isCyclic(nodes: Node[]): boolean {
    const adj = extractAdjacencyList(nodes);
    const numberOfNodes = adj.length;
    const visited = Array(numberOfNodes).fill(false);
    const dfsVisited = Array(numberOfNodes).fill(false);

    for (let i = 0; i < numberOfNodes; i++) if (!visited[i] && checkCycle(i, adj, visited, dfsVisited)) return true;

    return false;
}
