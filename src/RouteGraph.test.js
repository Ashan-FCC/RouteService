
const Graph = require('./RouteGraph')
const RouteCostError = require('./Errors/RouteCostError')
const assert = require('chai').assert

describe('Graph', () => {
  const g = new Graph()
  const edges = [
    ['A', 'B', 1],
    ['A', 'C', 4],
    ['A', 'D', 10],
    ['B', 'E', 3],
    ['C', 'D', 4],
    ['C', 'F', 2],
    ['D', 'E', 1],
    ['E', 'B', 3],
    ['E', 'A', 2],
    ['F', 'D', 1]
  ]
  for (const e of edges) { g.connect(...e) }

  describe('Route Cost: ', () => {
    const testCases = [
      { route: ['A', 'B', 'E'], cost: 4 },
      { route: ['A', 'D'], cost: 10 },
      { route: ['E', 'A', 'C', 'F'], cost: 8 },
      { route: ['A', 'D', 'F'], cost: -1 }
    ]

    testCases.forEach(test => {
      const route = test.route
      const cost = test.cost
      it(`Route: ${route} costs: ${cost}`, () => {
        if (cost !== -1){
          assert.equal(g.costOfRoute(route), cost)
        } else {
          assert.throws(() => g.costOfRoute(route), RouteCostError)
        }
      })
    })
  })

  describe('Calculated the possible delivery routes', () => {
    it('without duplicates and with max stops: E to D', () => {
      assert.equal(g.calcPossibleRoutes('E', 'D', 4).length, 4)
    })
    it('without duplicates only: E to E', () => {
      assert.equal(g.calcPossibleRoutes('E', 'E').length, 5)
    })
    /**
     * TODO : Bonus question test
    it('without duplicates and with max stops: E to D', () => {
      assert.equal(g.calcPossibleRoutes('E', 'D').length, 4)
    })
     */
  })

  describe('The cheapest delivery route cost: ', () => {
    const testCases = [
      { start: 'E', end: 'D', cost: 9 },
      { start: 'E', end: 'E', cost: 6 },
      { start: 'A', end: 'E', cost: 4 }
    ]

    testCases.forEach(test => {
      const start = test.start
      const end = test.end
      const cost = test.cost

      it(`${start} to ${end} should be ${cost}`, () => {
        assert.equal(g.getCheapestRoute(start, end).distance, test.cost)
      })
    })
  })
})
