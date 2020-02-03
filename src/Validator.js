'use strict'

const ValidationError = require('./Errors/ValidationError')
const alphaRegex = /^[ A-Z]*$/

function validateGraph (inputArray) {
  if (!Array.isArray(inputArray) || !inputArray.every(element => Array.isArray(element))) {
    throw new ValidationError('Input must be an array of arrays like: [[from, to, distance]]')
  }
  inputArray.forEach(arr => {
    validateEdge(arr)
  })
}

function validateEdge (input) {
  if (input.length < 2 ||
        typeof input[0] !== 'string' ||
        typeof input[1] !== 'string' ||
        (input.length > 2 && !Number.isInteger(input[2]))) {
    throw new ValidationError('Input must be an array of [from: string, to: string , distance: int]')
  }
}

function validateRoute (route) {
  const hyphensRemoved = route.split('-').join('')

  if (!alphaRegex.test(hyphensRemoved)) {
    throw new ValidationError('Route must have uppercase alphabetical characters')
  }
  if (hyphensRemoved.split('').length < 2) { throw new ValidationError('Route must have atleast 2 stop') }
  return hyphensRemoved.split('')
}

function validateInput (start, end, maxStops = 1) {
  if (!alphaRegex.test(start) || !alphaRegex.test(end)) {
    throw new ValidationError('start and end must have uppercase alphabetical characters')
  }

  if (!Number.isInteger(maxStops)) {
    throw new ValidationError('max stop should be an integer')
  }
}

module.exports = {
  validateGraph,
  validateEdge,
  validateRoute,
  validateInput
}
