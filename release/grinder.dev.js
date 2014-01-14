// Grinder v0.1.0
// Copyright 2014 Justin Martin, MIT License
// http://github.com/justspamjustin/grinder
(function() {
  window.Grinder = {};

  window.controller = function(Cont) {
    var begin, controllerName, e;
    begin = 'function ';
    controllerName = null;
    try {
      controllerName = Cont.toString().match(new RegExp("" + begin + ".*Controller"))[0].replace(begin, '');
    } catch (_error) {
      e = _error;
      throw new Error("Controller should be named ending in Controller");
    }
    Grinder.controllers || (Grinder.controllers = {});
    return Grinder.controllers[controllerName] = Cont;
  };

  window.view = function(View) {
    var begin, e, viewName;
    begin = 'function ';
    viewName = null;
    try {
      viewName = View.toString().match(new RegExp("" + begin + ".*View"))[0].replace(begin, '');
    } catch (_error) {
      e = _error;
      throw new Error("View should be named ending in View");
    }
    Grinder.views || (Grinder.views = {});
    return Grinder.views[viewName] = View;
  };

}).call(this);

(function() {
  Grinder.Application = (function() {
    function Application() {}

    Application.prototype.start = function() {
      _.mixin(_.string.exports());
      this.setupRoutes();
      this.setupEmbeddedControllers($('body'));
      return Backbone.history.start({
        pushState: true
      });
    };

    Application.prototype.setupRoutes = function() {
      var Router, action, controller, controllerInstances, newRoutes, route, _fn,
        _this = this;
      this.appRoutes = this.getRoutes();
      newRoutes = {};
      controllerInstances = [];
      _fn = function(controller, action) {
        return newRoutes[route] = function() {
          var $el;
          $el = $('#main');
          return _this.setupNewController(controller, $el, action);
        };
      };
      for (route in this.appRoutes) {
        action = this.appRoutes[route];
        controller = this.initializeControllerFromAction(action);
        controllerInstances.push(controller);
        _fn(controller, action);
      }
      Router = Backbone.Router.extend({
        routes: newRoutes
      });
      this.appRouter = new Router();
      return this.setupRouteEvents(controllerInstances);
    };

    Application.prototype.setupRouteEvents = function(controllerInstances) {
      return this.appRouter.on('route', function(route, params) {
        var controller, routeName, _i, _len, _results;
        routeName = window.location.href.replace(/^http(s)?:\/\/[^\/]+\//, '');
        _results = [];
        for (_i = 0, _len = controllerInstances.length; _i < _len; _i++) {
          controller = controllerInstances[_i];
          _results.push(typeof controller.onRoute === "function" ? controller.onRoute(routeName, params) : void 0);
        }
        return _results;
      });
    };

    Application.prototype.setupNewController = function(controller, $el, action) {
      var actionName, controllerName, r, t, _ref;
      _ref = action.split("#"), controllerName = _ref[0], actionName = _ref[1];
      controller[actionName]();
      t = Grinder.views["" + (_(controllerName).titleize()) + "View"].t;
      r = new Ractive({
        el: $el,
        template: t,
        data: controller
      });
      r.on('set', function() {
        this.initializeEvents($el, t, controller, r);
        return this.initializeAnchorEvents();
      });
      this.initializeEvents($el, t, controller, r);
      return this.initializeAnchorEvents();
    };

    Application.prototype.initializeControllerFromAction = function(action) {
      var controllerName;
      controllerName = action.split('#')[0];
      controllerName = "" + (_(controllerName).titleize()) + "Controller";
      return new Grinder.controllers[controllerName];
    };

    Application.prototype.routes = function(routeFn) {
      this.getRoutes = routeFn;
      return this;
    };

    Application.prototype.getRoutes = function() {
      throw new Error('You must provide a routes function that returns your routes.');
    };

    Application.prototype.initializeEvents = function(el, template, controller, r) {
      var actionName, eventName, sel, selectors, _i, _len, _results,
        _this = this;
      selectors = template.match(/event-(\w*)=['"]#\w+['"]/gm) || [];
      _results = [];
      for (_i = 0, _len = selectors.length; _i < _len; _i++) {
        sel = selectors[_i];
        eventName = sel.replace(/event\-|=.*/g, '');
        actionName = sel.replace(/event-(.*)=.#/, '');
        actionName = actionName.substring(0, actionName.length - 1);
        _results.push((function(sel, controller, eventName, actionName, r) {
          $("[" + sel + "]").off(eventName);
          return $("[" + sel + "]").on(eventName, function(e) {
            var key, value;
            controller[actionName](e);
            for (key in controller) {
              value = controller[key];
              r.set(key, value);
            }
            return _this.initializeEvents(el, template, controller, r);
          });
        })(sel, controller, eventName, actionName, r));
      }
      return _results;
    };

    Application.prototype.setupEmbeddedControllers = function($el) {
      var controllerContainers,
        _this = this;
      controllerContainers = $el.find('[controller]');
      return controllerContainers.each(function(i, el) {
        var action, controller;
        action = $(el).attr('controller');
        controller = _this.initializeControllerFromAction(action);
        _this.setupNewController(controller, $(el), action);
        return _this.setupRouteEvents([controller]);
      });
    };

    Application.prototype.initializeAnchorEvents = function() {
      return $('a').each(function() {
        $(this).off('click.navigate');
        return $(this).on('click.navigate', function(e) {
          var href;
          href = $(this).attr('href');
          if (!/^(http(s)?:)?\/\/.*$/.test(href)) {
            e.preventDefault();
            return Backbone.history.navigate(href, {
              trigger: true
            });
          }
        });
      });
    };

    return Application;

  })();

}).call(this);
