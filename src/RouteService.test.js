'use strict'

const RouteService = require('./RouteService')
const assert = require('chai').assert

const graphArray = [
  ['A', 'B', 2],
  ['A', 'C', 5],
  ['B', 'A', 1],
  ['B', 'D', 3]
]

const routeService = RouteService.FromArray(graphArray)

describe('High level test for RouteService', () => {
  it('should return graph as an array of arrays for clients to save the modified graph', () => {
    const newEdge = ['C', 'D', 1]
    routeService.addEdge(newEdge)
    graphArray.push(newEdge)
    assert.deepEqual(routeService.getGraphAsArray(), graphArray)
  })

  it('should return -1 when there is no route for cheapestRoute, calculateAllRoutes and routeCostCalculation', () => {
    const expectedResult = -1
    assert.equal(routeService.cheapestRoute('D', 'A'), expectedResult)
    assert.equal(routeService.costOfRoute('D-A'), expectedResult)
    assert.equal(routeService.numberOfPossibleRoutes('D', 'A'), expectedResult)
  })

  it('should return correct values for cheapestRoute', () => {
    assert.equal(routeService.cheapestRoute('A', 'D'), 5)

    const newEdge = ['C', 'D', 1]
    routeService.addEdge(newEdge)
    assert.equal(routeService.costOfRoute('A-C-D'), 6)

    assert.equal(routeService.numberOfPossibleRoutes('A', 'D'), 3)
  })

  it('should return correct values for numberOfPossibleRoutes', () => {
    assert.equal(routeService.numberOfPossibleRoutes('A', 'D'), 3)
  })

  it('should return correct values for costOfRoute', () => {
    const newEdge = ['C', 'D', 1]
    routeService.addEdge(newEdge)
    assert.equal(routeService.costOfRoute('A-C-D'), 6)
  })
})
