'use strict'

const RouteCostError = require('./Errors/RouteCostError')

class RouteGraph {
  constructor () {
    this.map = {}
  }

  /**
     * Adds a given route to the graph
     * @param from
     * @param to
     * @param distance
     * @returns {Graph}
     */
  connect (from, to, distance = 1) {
    if (!this.map.hasOwnProperty(from)) {
      this.map[from] = {}
    }

    const routeStart = this.map[from]
    if (!routeStart.hasOwnProperty(to) || routeStart[to] < distance) {
      routeStart[to] = distance
      this.map[from] = routeStart
    }
    return this
  }

  /**
     * Calculates the cost of a given route
     * @param stops
     * @returns {number}
     */
  costOfRoute (stops) {
    let costOfRoute = 0
    let currentStop = stops.shift()

    while (stops.length > 0) {
      if (!this.map.hasOwnProperty(currentStop)) { throw new RouteCostError('No such route') }
      const nextStop = stops.shift()
      const availableStops = this.map[currentStop]

      if (!availableStops.hasOwnProperty(nextStop)) {
        throw new RouteCostError('No such route')
      }

      costOfRoute += availableStops[nextStop]
      currentStop = nextStop
    }

    return costOfRoute
  }

  /**
     * Calculates the cheapest route
     * @param start
     * @param end
     * @returns {{path: string[], distance: int}}
     */
  getCheapestRoute (start, end) {
    // track lowest cost to reach each node
    const startingPoint = this.map[start]
    const costs = Object.assign({ [end]: Infinity }, startingPoint)

    // track paths
    const parents = { finish: end }
    for (const child in startingPoint) {
      parents[child] = 'start'
    }

    // track nodes that have already been processed
    const processed = []

    let node = lowestCostNode(costs, processed)

    while (node) {
      const cost = costs[node]
      const children = this.map[node]
      for (const n in children) {
        const newCost = cost + children[n]
        if (!costs[n]) {
          costs[n] = newCost
          parents[n] = node
        }
        if (costs[n] > newCost) {
          costs[n] = newCost
          parents[n] = node
        }
      }
      processed.push(node)
      node = lowestCostNode(costs, processed)
    }

    const optimalPath = ['finish']
    let parent = parents.finish
    while (parent) {
      optimalPath.push(parent)
      parent = parents[parent]
    }
    optimalPath.reverse()

    const results = {
      distance: costs[end],
      path: optimalPath
    }

    return results

    function lowestCostNode(costs, processed){
      return Object.keys(costs).reduce((lowest, node) => {
        if (lowest === null || costs[node] < costs[lowest]) {
          if (!processed.includes(node)) {
            lowest = node
          }
        }
        return lowest
      }, null)
    }
  }

  /**
     * Calculates the number of possible routes
     * @param from
     * @param to
     * @param duplicateRoutes
     * @param maxSize
     * @param maxCost
     * @returns {*[]}
     */
  calcPossibleRoutes (from, to, maxStops = Infinity) {
    const path = []

    const linkedNodes = memoize(nodes.bind(null, convertGraphToGraphArray(this.map)))
    return explore(from, to).filter(s => s.length <= (maxStops + 1))

    function convertGraphToGraphArray (graph) {
      const graphArray = []
      for (const node in graph) {
        for (const adjacentNode in graph[node]) {
          graphArray.push([node, adjacentNode, graph[node][adjacentNode]])
        }
      }
      return graphArray
    }

    function explore (currNode, to, resolvedPaths = [], path = []) {
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
          explore(linkedNode, to, resolvedPaths, path)
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
      return indices
    }

    /**
     * Avoids recalculating linked nodes.
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
  }
}

module.exports = RouteGraph
