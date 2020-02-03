
const ValidationError = require('./Errors/ValidationError')

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
        (input.length > 2 && typeof input[2] !== 'number')) {
    throw new ValidationError('Input must be an array of [from: string, to: string , distance: int]')
  }
}

function validateRoute(route){
  const hyphensRemoved = route.split('-').join('')
  const alphaRegex = /^[ A-Z]*$/
  if(!alphaRegex.test(hyphensRemoved)){
    throw new ValidationError('Route must have uppercase numeric characters')
  }
  if (hyphensRemoved.split('').length < 2)
    throw new ValidationError('Route must have atleast 2 stop')
  return hyphensRemoved
}

module.exports = {
  validateGraph,
  validateEdge,
  validateRoute
}
