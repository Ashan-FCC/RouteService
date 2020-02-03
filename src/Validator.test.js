'use strict'

const ValidationError = require('./Errors/ValidationError')
const {validateGraph, validateEdge, validateRoute } = require('./Validator')
const assert = require('chai').assert

describe('Validator', () => {
    describe('validate every edge', () => {
        const testCases = [
            {edge: [1], validates: false},
            {edge: [1, 1], validates: false},
            {edge: ['A', 1], validates: false},
            {edge: ['A', 'B', 'C'], validates: false},
            {edge: ['A', 'B', 2], validates: true},
            {edge: ['A', 'B'], validates: true},
        ]
        testCases.forEach(test => {
            it(`should validate edge: ${test.edge} - to be ${test.validates}`, () => {
                if(test.validates){
                    assert.doesNotThrow(() => validateEdge(test.edge))
                } else {
                    assert.throws(() => validateEdge(test.edge), ValidationError)
                }
            })
        })
    })

    describe('validate every full graph', () => {
        const testCases = [
            {graph: 'error', validates: false},
            {
                graph: [
                    1, 2
                ],
                validates: false
            },
            {
                graph: [
                    ['A', 'B', 1]
                ],
                validates: true
            },
            {
                graph: [
                    ['A', 1, 1]
                ],
                validates: false
            }

        ]
        testCases.forEach(test => {
            it(`should validate graph: ${test.graph} - to be ${test.validates}`, () => {
                if(test.validates){
                    assert.doesNotThrow(() => validateGraph(test.graph))
                } else {
                    assert.throws(() => validateEdge(test.graph), ValidationError)
                }
            })
        })
    })

    describe('validate route for cost calculation', () => {
        const testCases = [
            {route: 'A-S-V-1', validates: false},
            {route: 'ABCD', validates: true},
            {route: 'A-B-C-D', validates: true},
        ]
        testCases.forEach(test => {
            it(`should validate edge: ${test.route} - to be ${test.validates}`, () => {
                if(test.validates){
                    assert.doesNotThrow(() => validateRoute(test.route))
                } else {
                    assert.throws(() => validateRoute(test.route), ValidationError)
                }
            })
        })
    })
})
