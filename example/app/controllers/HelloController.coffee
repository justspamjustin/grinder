controller class HelloController
  index: ->
    @receiver = "world"
    @message = "hello"

  onClickAdd: ->
    @i ||= 0
    @i++
    @items ||= []
    @items.push @i

  onClickRemove: (e) ->
    e.preventDefault()
    index = $(e.target).parent().index()
    console.log index
    @items.splice(index, 1)
