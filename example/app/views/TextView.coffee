view class TextView
  @t: """
  <div contenteditable='true' value="{{value}}"></div>
  <p>
  {{{value}}}
  </p>
  <div>File</div>
  <div><input type="file" value="{{fileValue}}"/> {{fileValue.0.name}}</div>
  """