window.Grinder = {}
window.controller = (Cont)->
  begin = 'function '
  controllerName = null
  try
    controllerName = Cont.toString().match(new RegExp("#{begin}.*Controller"))[0].replace(begin, '')
  catch e
    throw new Error("Controller should be named ending in Controller")
  Grinder.controllers ||= {}
  Grinder.controllers[controllerName] = Cont

window.view = (View)->
  begin = 'function '
  viewName = null
  try
    viewName = View.toString().match(new RegExp("#{begin}.*View"))[0].replace(begin, '')
  catch e
    throw new Error("View should be named ending in View")
  Grinder.views ||= {}
  Grinder.views[viewName] = View
