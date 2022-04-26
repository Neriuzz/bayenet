import Node from "../entities/Node";

function extractAdjacencyList(nodes: Node[]) {
	const adj: number[][] = nodes.map(() => []);
	nodes.forEach((node) => {
		node.edges.forEach((edge) => {
			if (edge.to && edge.to.id !== node.id) {
				adj[nodes.indexOf(node)].push(nodes.indexOf(edge.to));
			}
		});
	});
	return adj;
}

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

export default function isCyclic(nodes: Node[]): boolean {
	const adj = extractAdjacencyList(nodes);
	const numberOfNodes = adj.length;
	const visited = Array(numberOfNodes).fill(false);
	const dfsVisited = Array(numberOfNodes).fill(false);

	for (let i = 0; i < numberOfNodes; i++) if (!visited[i] && checkCycle(i, adj, visited, dfsVisited)) return true;

	return false;
}
