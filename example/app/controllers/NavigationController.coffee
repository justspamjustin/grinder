controller class NavigationController
  index: ->

  onRoute: (route)->
    $(".navigation-item").removeClass("active")
    $("a.navigation-item[href='#{route}']").addClass("active")