view class HelloView
  @t: """
      {{message}} {{receiver}}!
      <button event-click="#onClickAdd">+</button>
      <ul>
        {{#items}}
        <li data-id="{{.}}">Item {{.}} <a href="#" event-click="#onClickRemove">&times;</a></li>
        {{/items}}
      </ul>
      <a href="bye">goodbye</a>
  """