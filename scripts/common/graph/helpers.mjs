import { readFile } from 'fs/promises';

export const ROOT_KEY = '__ROOT__';

export async function importJson(filename) {
  const json = JSON.parse(await readFile(new URL(filename, import.meta.url)));

  return json;
}

export function removeEdgeTo(targetNode, graph) {
  for (const node of graph.keys()) {
    graph.set(
      node,
      graph.get(node).filter((edge) => edge !== targetNode)
    );
  }
}

function add(data, list) {
  const { node, indeg, outdeg } = data;

  if (!list.has(node)) {
    list.set(node, {
      indeg: [],
      outdeg: [],
    });
  }

  const recored = list.get(node);
  if (indeg) {
    recored.indeg.push(...indeg);
  }
  if (outdeg) {
    recored.outdeg.push(...outdeg);
  }

  return list;
}

export function normalizeNXDependencies(deps) {
  const output = new Map();
  Object.keys(deps).forEach((node) => {
    output.set(
      node,
      deps[node].map((depNode) => depNode.target)
    );
  });
  return output;
}
/*
Output:
'@rango-test/signer-evm' => { indeg: 18, outdeg: 0 },
*/
export function detectEdges(nodesWithDependecies) {
  const output = new Map();
  nodesWithDependecies.forEach((targetNodes, sourceNode) => {
    const data = {
      node: sourceNode,
      outdeg: targetNodes,
    };

    // Add/update source target
    add(data, output);

    // Update target node
    if (nodesWithDependecies.get(sourceNode).length > 0) {
      targetNodes.forEach((targetNode) => {
        add({ node: targetNode, indeg: [sourceNode] }, output);
      });
    }
  });

  return output;
}

export function nxToGraph(nx, graph) {
  const nodes = Object.keys(nx.graph.nodes);
  nodes.forEach((node) => graph.addNode(node));

  const edges = detectEdges(normalizeNXDependencies(nx.graph.dependencies));

  edges.forEach((sourceNodeValue, sourceNode) => {
    if (sourceNodeValue.outdeg.length > 0) {
      sourceNodeValue.outdeg.forEach((targetNode) => {
        graph.addEdge(sourceNode, targetNode);
      });
    }

    // If there is no indeg, it means it's a root package.
    if (sourceNodeValue.indeg.length === 0) {
      graph.addEdge(ROOT_KEY, sourceNode);
    }
  });

  return {
    edgesCount: edges.size,
    nodesCount: nodes.length,
  };
}

export function bubbleUp(result, nodesWithEdges, targetNode) {
  nodesWithEdges.get(targetNode).indeg.forEach((parentNode) => {
    result.add(parentNode);
    bubbleUp(result, nodesWithEdges, parentNode);
  });
}
