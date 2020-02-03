'use strict'

const RouteGraph = require('./RouteGraph')
const RouteCalculationError = require('./Errors/RouteCalculationError')
const {validateGraph, validateEdge, validateRoute, validateInput} = require('./Validator')

class RouteService {
  constructor () {
    this.graph = new RouteGraph()
  }

  /**
   * Input an array of edges eg: [['A', 'B', 1], ['B', 'D', 5]]
   * @param inputArray
   * @returns {RouteService}
   * @constructor
   */
  static FromArray (inputArray) {
    validateGraph(inputArray)

    const r = new RouteService()
    const g = new RouteGraph()
    inputArray.forEach(arr => {
      g.connect(...arr)
    })
    r.graph = g
    return r
  }

  addEdge (edge) {
    validateEdge(edge)
    this.graph.connect(...edge)
  }

  costOfRoute (route) {
    const validatedRoute = validateRoute(route)
    let result
    try {
      result = this.graph.costOfRoute(validatedRoute)
    } catch (e) {
      if (e instanceof RouteCalculationError) {
        result = -1
      } else {
        throw e
      }
    }
    return result
  }

  numberOfPossibleRoutes (start, end, maxStops) {
    validateInput(start, end, maxStops)
    let result
    try {
      result = this.graph.calcPossibleRoutes(start, end, maxStops)
    } catch (e) {
      if (e instanceof RouteCalculationError) {
        result = -1
      } else {
        throw e
      }
      return result
    }
    return result.length
  }

  cheapestRoute (start, end) {
    validateInput(start, end)
    let result
    try {
      result = this.graph.getCheapestRoute(start, end)
    } catch (e) {
      if (e instanceof RouteCalculationError) {
        result = {distance: -1}
      } else {
        throw e
      }

    }
    return result.distance
  }

  getGraphAsArray () {
    const graphMap = Object.assign({}, this.graph.map)
    const graphArray = []
    for (const node in graphMap) {
      for (const adjacentNode in graphMap[node]) {
        graphArray.push([node, adjacentNode, graphMap[node][adjacentNode]])
      }
    }
    return graphArray
  }
  /**
   * TODO: Add method for bonus question
  possibleRoutesUnderCost(start, end, maxCost){
    const result = this.graph.calcPossibleRoutes(start, end, maxStops)

  }
   */
}

module.exports = RouteService
