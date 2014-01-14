class Grinder.Application
  start: ->
    _.mixin(_.string.exports());
    @setupRoutes()
    @setupEmbeddedControllers($('body'))
    Backbone.history.start pushState: true

  setupRoutes: ->
    @appRoutes = @getRoutes()
    newRoutes = {}
    controllerInstances = []
    for route of @appRoutes
      action = @appRoutes[route]
      controller = @initializeControllerFromAction(action)
      controllerInstances.push(controller)
      do (controller, action) =>
        newRoutes[route] = =>
          $el = $('#main')
          @setupNewController(controller, $el, action)
    Router = Backbone.Router.extend routes: newRoutes
    @appRouter = new Router()
    @setupRouteEvents(controllerInstances)

  setupRouteEvents: (controllerInstances)->
    @appRouter.on 'route', (route, params)->
      routeName = window.location.href.replace(/^http(s)?:\/\/[^\/]+\//, '')
      for controller in controllerInstances
        controller.onRoute?(routeName, params)

  setupNewController: (controller, $el, action)->
    [controllerName, actionName] = action.split("#")
    controller[actionName]()
    {t} = Grinder.views["#{_(controllerName).titleize()}View"]
    r = new Ractive
      el: $el
      template: t
      data: controller
    r.on 'set', ->
      @initializeEvents($el, t, controller, r)
      @initializeAnchorEvents()
    @initializeEvents($el, t, controller, r)
    @initializeAnchorEvents()

  initializeControllerFromAction: (action) ->
    [controllerName] = action.split('#')
    controllerName = "#{_(controllerName).titleize()}Controller"
    new Grinder.controllers[controllerName]


  routes: (routeFn)->
    @getRoutes = routeFn
    @

  getRoutes: ->
    throw new Error('You must provide a routes function that returns your routes.')

  initializeEvents: (el, template, controller, r)->
    selectors = template.match(/event-(\w*)=['"]#\w+['"]/gm) || []
    for sel in selectors
      eventName = sel.replace(/event\-|=.*/g,'')
      actionName = sel.replace(/event-(.*)=.#/, '')
      actionName = actionName.substring(0, actionName.length - 1)
      do (sel, controller, eventName, actionName, r) =>
        $("[#{sel}]").off eventName
        $("[#{sel}]").on eventName, (e)=>
          controller[actionName](e)
          for key,value of controller
            r.set(key, value)
          @initializeEvents(el, template, controller, r)

  setupEmbeddedControllers: ($el)->
    controllerContainers = $el.find('[controller]')
    controllerContainers.each (i, el)=>
      action = $(el).attr('controller')
      controller = @initializeControllerFromAction(action)
      @setupNewController(controller, $(el), action)
      @setupRouteEvents([controller])

  initializeAnchorEvents: ->
    $('a').each ->
      $(@).off 'click.navigate'
      $(@).on 'click.navigate', (e)->
        href = $(@).attr('href')
        if ! /^(http(s)?:)?\/\/.*$/.test href
          e.preventDefault()
          Backbone.history.navigate(href, trigger: true)










