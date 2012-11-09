child_process = require 'child_process'
fs = require 'fs'
sysPath = require 'path'

module.exports = class CompassCompiler
  brunchPlugin: yes
  type: 'stylesheet'
  extension: 'scss'
  pattern: /\.s[ac]ss$/

  constructor: (@config) ->
    child_process.exec "compass --version", (error, stdout, stderr) =>
      if error
        console.error "You need to have Compass on your system"
        console.error "Execute `gem install compass`"

    fs.exists @config.paths.compass, (exists) =>
      unless exists
        console.error "Compass config file doesn't exist"
        console.error @config.paths.compass

    configPath = sysPath.join process.cwd(), @config.paths.compass

    child_process.exec "compass compile --config #{configPath}", (error, stdout, stderr) ->
      console.log "exec error: " + error  if error isnt null