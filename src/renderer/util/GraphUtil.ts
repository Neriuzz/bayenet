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

export default function isCyclic(numberOfNodes: number, adj: number[][]): boolean {
	let visited = Array(numberOfNodes).fill(false);
	let dfsVisited = Array(numberOfNodes).fill(false);

	for (let i = 0; i < numberOfNodes; i++)
		if (!visited[i] && checkCycle(i, adj, visited, dfsVisited))
			return true;

	return false;
}
