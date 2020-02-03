'use strict'

const RouteCalculationError = require('./Errors/RouteCalculationError')
const util = require('./graph-utils')
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
      if (!this.map.hasOwnProperty(currentStop)) { throw new RouteCalculationError('No such route') }
      const nextStop = stops.shift()
      const availableStops = this.map[currentStop]

      if (!availableStops.hasOwnProperty(nextStop)) {
        throw new RouteCalculationError('No such route')
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
    if (!startingPoint) {
      throw new RouteCalculationError('No such route')
    }
    const costs = Object.assign({[end]: Infinity}, startingPoint)

    // track paths
    const parents = {finish: end}
    for (const child in startingPoint) {
      parents[child] = 'start'
    }

    // track nodes that have already been processed
    const processed = []

    let node = util.lowestCostNode(costs, processed)

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
      node = util.lowestCostNode(costs, processed)
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
    if (!this.map.hasOwnProperty(from)) { throw new RouteCalculationError('No such route') }

    const linkedNodes = util.memoize(util.nodes.bind(null, util.convertGraphToGraphArray(this.map)))
    const allRoutes = util.explore(linkedNodes, from, to)
    return allRoutes.filter(route => route.length <= (maxStops + 1) && this.costOfRoute(route) > 0)
  }
}

module.exports = RouteGraph
