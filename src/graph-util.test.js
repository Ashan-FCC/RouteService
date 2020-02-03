'use strict'

const util = require('./graph-utils')
const assert = require('chai').assert

// example graph for testing
// AB2, AC5, BA1, BD3, CD1
const graphMap = {
  A: {B: 2, C: 5},
  B: {A: 1, D: 3},
  C: {D: 1}
}
describe('Util methods  used by RouteGraph', () => {
  it('should test return an array of arrays for the graph', () => {
    const expectedResult = [
      ['A', 'B', 2],
      ['A', 'C', 5],
      ['B', 'A', 1],
      ['B', 'D', 3],
      ['C', 'D', 1]
    ]
    assert.deepEqual(util.convertGraphToGraphArray(graphMap), expectedResult)
  })

  it('should test if an edge has been followed in a path', () => {
    const testCases = [
      {
        edge: {from: 'A', to: 'B'}, path: ['A', 'B'], result: true
      },
      {
        edge: {from: 'A', to: 'C'}, path: ['A', 'D', 'E'], result: false
      }
    ]
    testCases.forEach(({edge, path, result}) => {
      assert.equal(util.hasEdgeBeenFollowedInPath({edge, path}), result)
    })
  })

  it('should get all nodes linked to node', () => {
    const testCases = [
      {node: 'A', linkedNodes: ['B', 'C']},
      {node: 'B', linkedNodes: ['A', 'D']}
    ]
    // util.nodes.bind(null, util.convertGraphToGraphArray(graphMap))
    testCases.forEach(({node, linkedNodes}) => {
      assert.deepEqual(util.nodes(util.convertGraphToGraphArray(graphMap), node), linkedNodes)
    })
  })

  it('should test the lowestCostNode function', () => {
    const costs = Object.assign({D: Infinity}, graphMap.A)
    // track paths
    const parents = {finish: 'D'}
    for (const child in graphMap.A) {
      parents[child] = 'start'
    }
    assert.equal(util.lowestCostNode(costs, []), 'B')
  })

  it('should return the correct number of paths from explore', () => {
    const linkedNodes = util.memoize(util.nodes.bind(null, util.convertGraphToGraphArray(graphMap)))
    assert.equal(util.explore(linkedNodes, 'A', 'D').length, 3)
  })
})
