exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  modules:
    wrapper: false
    definition: false
  paths:
    compass: './config/compass.rb'
  files:
    javascripts:
      joinTo:
        'javascripts/modernizr.js': /^vendor(\/|\\)scripts(\/|\\)modernizr/
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor(?!\/scripts\/modernizr)/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: [
          'vendor/scripts/jquery-1.8.2.js',
          'vendor/scripts/underscore-1.4.0.js',
          'vendor/scripts/jquery.lettering.js',
        ]

    stylesheets:
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
      order:
        before: ['vendor/styles/foundation.css']

    templates:
      joinTo: 'javascripts/app.js'
