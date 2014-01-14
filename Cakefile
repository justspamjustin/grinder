fs = require 'fs'
coffee = require 'coffee-script'
{parser, uglify} = require("uglify-js")

packageJson = fs.readFileSync('package.json').toString()
version = JSON.parse(packageJson).version

copyright =
    """
    // Grinder v#{version}
    // Copyright 2014 Justin Martin, MIT License
    // http://github.com/justspamjustin/grinder
    """

addCopyRight = (str)->
  [copyright, str].join('\n')

fileNames = [
  'src/Globals.coffee'
  'src/Application.coffee'
]

builtFileNames =
  development: 'grinder.dev.js'
  production: 'grinder.min.js'

files = (coffee.compile(fs.readFileSync(file).toString()) for file in fileNames)

task 'build', 'build both the developmenht and production versions in the release dir', (options)->
  invoke 'build:development'
  invoke 'build:production'

task 'build:development', 'build the development version in the release dir', (options) ->
  fs.writeFileSync "release/#{builtFileNames.development}", addCopyRight files.join('\n')

task 'build:production', 'build the production version in the release dir', (options)->
  jsStr = files.join('')
  ast = parser.parse(jsStr)
  ast = uglify.ast_mangle(ast)
  ast = uglify.ast_squeeze(ast)
  productionCode = uglify.gen_code(ast)
  fs.writeFileSync "release/#{builtFileNames.production}", addCopyRight productionCode



