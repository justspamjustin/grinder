controller class TodoController
  index: ->

  onKeydown: (e)->
    if e.which is 13
      @add()

  add: ->
    @todos ||= []
    @todos.push(@inputValue.trim())
    @inputValue = ""
    $('#todo-input').focus()

  remove: (e)->
    e.preventDefault()
    i = $(e.target).parent().index()
    @todos.splice(i, 1)