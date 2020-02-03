
const RouteServiceError = require('./RouteServiceError')

class RouteCalculationError extends RouteServiceError {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}

module.exports = RouteCalculationError
