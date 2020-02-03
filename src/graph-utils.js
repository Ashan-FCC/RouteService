'use strict'

/**
 * Convert graph object to an array of arrays
 * @param graph
 * @returns {Array}
 */
function convertGraphToGraphArray (graph) {
  const graphArray = []
  for (const node in graph) {
    for (const adjacentNode in graph[node]) {
      graphArray.push([node, adjacentNode, graph[node][adjacentNode]])
    }
  }
  return graphArray
}

/**
 * Check if a given edge already exists in the path
 * @param edge
 * @param path
 * @returns {boolean}
 */
function hasEdgeBeenFollowedInPath ({edge, path}) {
  const indices = allIndices(path, edge.from)
  return indices.some(i => path[i + 1] === edge.to)
}

function allIndices (arr, val) {
  var indices = []
  var i
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      indices.push(i)
    }
  }
  return indices
}

/**
 * memoize arguments so as not to recalculate paths
 * @param fn
 * @returns {Function}
 */
function memoize (fn) {
  const cache = new Map()
  return function (arg) {
    var key = JSON.stringify(arguments)
    var cached = cache.get(key)
    if (cached) {
      return cached
    }
    cached = fn.apply(this, arguments)
    cache.set(key, cached)
    return cached
  }
}

/**
 * Get all nodes linked to, from node
 */
function nodes (graph, node) {
  return graph.reduce((p, c) => {
    (c[0] === node) && p.push(c[1])
    return p
  }, [])
}

/**
 * Find the lowest cost node
 * @param costs
 * @param processed
 * @returns {string}
 */
function lowestCostNode (costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if ((lowest === null || costs[node] < costs[lowest]) && (!processed.includes(node))) {
      lowest = node
    }
    return lowest
  }, null)
}

/**
 * Explore all possible paths to the destination from current ndoe
 * @param linkedNodes
 * @param currNode
 * @param to
 * @param resolvedPaths
 * @param path
 * @returns {Array}
 */
function explore (linkedNodes, currNode, to, resolvedPaths = [], path = []) {
  path.push(currNode)
  for (const linkedNode of linkedNodes(currNode)) {
    if (linkedNode === to) {
      const result = path.slice()
      result.push(to)
      resolvedPaths.push(result)
      continue
    }
    // do not re-explore edges
    if (!hasEdgeBeenFollowedInPath({
      edge: {
        from: currNode,
        to: linkedNode
      },
      path
    })) {
      explore(linkedNodes, linkedNode, to, resolvedPaths, path)
    }
  }
  path.pop() // sub-graph fully explored
  return resolvedPaths
}

module.exports = {
  convertGraphToGraphArray,
  explore,
  hasEdgeBeenFollowedInPath,
  memoize,
  nodes,
  lowestCostNode
}
