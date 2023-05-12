import { bubbleUp, detectEdges, removeEdgeTo, ROOT_KEY } from './helpers.mjs';

class Graph {
  constructor() {
    this.nodes = new Map();
    this.addNode(ROOT_KEY);
  }

  addNode(node) {
    this.nodes.set(node, []);
  }

  addEdge(source, destination) {
    this.nodes.get(source).push(destination);
  }

  onlyAffected(list) {
    const finalNodes = new Set();
    const edges = detectEdges(this.nodes);

    list.forEach((affectedNode) => {
      finalNodes.add(affectedNode);
      bubbleUp(finalNodes, edges, affectedNode);
    });

    const nextNodes = new Map();
    this.nodes.forEach((edges, node) => {
      if (finalNodes.has(node)) {
        nextNodes.set(
          node,
          edges.filter((dependentOnNode) => {
            return finalNodes.has(dependentOnNode);
          }),
        );
      }
    });

    this.nodes = nextNodes;
  }

  sort() {
    const sortedList = new Set();

    const tempGraph = structuredClone(this.nodes);
    while (tempGraph.size > 1) {
      this.kindaDFS(ROOT_KEY, sortedList, tempGraph);
    }

    return sortedList;
  }

  kindaDFS(startNode, sortedList, graph) {
    const visitedNodes = new Map();
    this.dfs(startNode, visitedNodes, graph);

    visitedNodes.forEach((value, node) => {
      if (value.outdeg === 0) {
        sortedList.add(node);
        graph.delete(node);
        removeEdgeTo(node, graph);
      }
    });
  }

  dfs(node, visitedNodes, graph) {
    const neighbors = graph.get(node);
    visitedNodes.set(node, {
      outdeg: neighbors.length,
    });
    for (const neighbor of neighbors) {
      if (!visitedNodes.has(neighbor)) {
        this.dfs(neighbor, visitedNodes, graph);
      }
    }
  }

  toString() {
    let output = '';
    for (const [node, neighbors] of this.nodes) {
      let neighborsStr = neighbors.length > 0 ? neighbors.join(', ') : 'None';
      output += `${node} -> ${neighborsStr}\n`;
    }

    return output;
  }
}

export { Graph };
