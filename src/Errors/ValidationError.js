'use strict'
const RouteServiceError = require('./RouteServiceError')

class ValidationError extends RouteServiceError {
    constructor (message) {
        super(message)
        this.name = this.constructor.name
    }
}

module.exports = ValidationError
