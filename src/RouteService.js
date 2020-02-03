
const RouteGraph = require('./RouteGraph')
const { validateGraph, validateEdge, validateRoute } = require('./Validator')

class RouteService {
  constructor () {
    this.graph = new RouteGraph()
  }

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
    const result = this.graph.costOfRoute(validatedRoute)
  }

  numberOfPossibleRoutes(start, end, maxStops){
    const result = this.graph.calcPossibleRoutes(start, end, maxStops)
  }
}

module.exports = RouteService
