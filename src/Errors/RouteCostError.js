'use strict'
const RouteServiceError = require('./RouteServiceError')

class RouteCostError extends RouteServiceError {
    constructor (message) {
        super(message)
        this.name = this.constructor.name
    }
}

module.exports = RouteCostError
