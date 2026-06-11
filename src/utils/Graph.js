export class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
  }

  addEdge(source, destination, weight, currency) {
    this.addNode(source);
    this.addNode(destination);
    this.adjacencyList.get(source).push({ node: destination, weight, currency });
  }

  getAdjacencyList() {
    return this.adjacencyList;
  }

  bfs(start, end) {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return {
        path: null,
        visitedOrder: [],
        totalValue: 0,
        hops: 0,
      };
    }

    const queue = [[start]];
    const visited = new Set([start]);
    const visitedOrder = [];

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      visitedOrder.push(node);

      if (node === end) {
        let totalValue = 0;
        for (let i = 0; i < path.length - 1; i++) {
          const current = path[i];
          const nextNode = path[i + 1];
          const edges = this.adjacencyList.get(current) || [];
          const edge = edges.find(e => e.node === nextNode);
          if (edge) {
            totalValue += edge.weight;
          }
        }
        return {
          path,
          visitedOrder,
          totalValue,
          hops: path.length - 1,
        };
      }

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push([...path, neighbor.node]);
        }
      }
    }

    return {
      path: null,
      visitedOrder,
      totalValue: 0,
      hops: 0,
    };
  }
}
