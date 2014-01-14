view class TodoView
  @t: """
    <input type="text" placeholder="What do you need to do?" value="{{inputValue}}" event-keydown="#onKeydown"/> <button event-click="#add">+</button>
    <ul>
      {{#todos}}
      <li>{{.}} <a href="#" event-click="#remove">&times;</a></li>
      {{/todos}}
    </ul>
  """