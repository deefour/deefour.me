## compass-brunch
Adds Compass support to
[brunch](http://brunch.io).

## Usage
Add `"compass-brunch": "x.y.z"` to `package.json` of your brunch app.

Pick a plugin version that corresponds to your minor (y) brunch version.

If you want to use git version of plugin, add
`"compass-brunch": "git+ssh://git@github.com:anthonyshort/compass-brunch.git"`.

Add your Compass config file to your project and point your config.coffee to it:

```coffee
exports.config =
  paths:
    compass: './compass.rb'
```

It will now compile your project using `compass compile` whenever a sass or scss file in your project changes.