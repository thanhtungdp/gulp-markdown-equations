'use strict'

var sizeOf = require('image-size')
  , path = require('path')
  , gutil = require('gulp-util')
  , extend = require('util-extend')

module.exports = EquationLookup

function EquationLookup() {
  this.equations = {}
}

EquationLookup.prototype.store = function(equation) {
  var key = equation.basename
  var eqset = this.equations[key] = this.equations[key] || []
  eqset.push( equation )

  return equation
}

EquationLookup.prototype.complete = function(file, callback) {
  var key = path.basename(gutil.replaceExtension(file.path, '.tex'))
  var eqset = this.equations[key] = this.equations[key] || []
  var equation = eqset.pop(equation)

  var meta = {}

  try {
    var dimensions = sizeOf(file.contents)
    meta.width = dimensions.width
    meta.height = dimensions.height
  } catch(e) { }

  meta.path = path.relative(file.cwd, file.path)

  meta = extend(equation.params,meta)
  meta.equation = equation

  callback.bind(meta)(function(result) {
    equation.callback(result)
  })

  return equation
}