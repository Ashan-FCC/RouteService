'use strict'

function convertGraphToGraphArray (graph) {
    const graphArray = []
    for (const node in graph) {
        for (const adjacentNode in graph[node]) {
            graphArray.push([node, adjacentNode, graph[node][adjacentNode]])
        }
    }
    return graphArray
}

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

function hasEdgeBeenFollowedInPath ({ edge, path }) {
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
    return arr.filter(e => e === val)
    //return indices
}

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

module.exports = {
    convertGraphToGraphArray,
    explore,
    hasEdgeBeenFollowedInPath,
    allIndices,
    memoize,
    nodes
}
