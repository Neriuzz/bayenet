import Node from "../entities/Node";
import World from "../World";

function extractAdjacencyList(nodes: Node[]) {
	let adj: number[][] = nodes.map(() => []);
	nodes.forEach(node => {
		node.edges.forEach(edge => {
			if (edge.to && edge.to.id !== node.id){
				adj[nodes.indexOf(node)].push(nodes.indexOf(edge.to));
			}
		});
	});
	return adj;
}

function checkCycle(node: number, adj: number[][], visited: boolean[], dfsVisited: boolean[]): boolean {
	visited[node] = true;
	dfsVisited[node] = true;
	for(let child of adj[node]) {
		if (!visited[child] && checkCycle(child, adj, visited, dfsVisited))
			return true;
		else if (dfsVisited[child])
			return true;
	}

	dfsVisited[node] = false;
	return false;
}

export default function isCyclic(nodes: Node[]): boolean {
	let adj = extractAdjacencyList(nodes);
	let numberOfNodes = adj.length;
	let visited = Array(numberOfNodes).fill(false);
	let dfsVisited = Array(numberOfNodes).fill(false);

	for (let i = 0; i < numberOfNodes; i++)
		if (!visited[i] && checkCycle(i, adj, visited, dfsVisited))
			return true;

	return false;
}
