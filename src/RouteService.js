
const RouteGraph = require('./RouteGraph')
const RouteCostError = require('./Errors/RouteCostError')
const { validateGraph, validateEdge, validateRoute } = require('./Validator')

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

  costOfRoute(route){
    const validatedRoute = validateRoute(route)
    let result
    try {
      result = this.graph.costOfRoute(validatedRoute)
    } catch(e) {
      if (e instanceof RouteCostError){
        result = -1
      } else {
        throw e
      }
    }
    return result
  }

  numberOfPossibleRoutes(start, end, maxStops){
    const result = this.graph.calcPossibleRoutes(start, end, maxStops)
    return result.length
  }

  /**
   * TODO: Add method for bonus question
  possibleRoutesUnderCost(start, end, maxCost){
    const result = this.graph.calcPossibleRoutes(start, end, maxStops)

  }
   */
}

module.exports = RouteService
