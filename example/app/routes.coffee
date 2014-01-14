(new Application()).routes ->
  'hi': 'hello#index'
  'bye': 'bye#index'
  'todo': 'todo#index'
  'text': 'text#index'
.start()