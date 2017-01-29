# Deefour.me

http://deefour.me - My personal website.

(c) 2013-2014 Jason Daly (jason@deefour.me)

## Description

Deefour.me is my online profile; a static site running on [Amazon S3](http://aws.amazon.com/s3/) through their [static website hosting](http://docs.amazonwebservices.com/AmazonS3/latest/dev/WebsiteHosting.html) built with [Webpack](https://webpack.js.org/).

The current iteration of the site fills the background with a grid of eight-pixel cells given random opacity. One hundred seeds are applied to the grid and [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) plays out.

## Installation

The following [`s3cmd`](http://s3tools.org/s3cmd) command should be run with the root of this repo as the current working directory.

```bash
s3cmd -P sync dist/* s3://www.deefour.me
```

### Version 4.0.0 - January 29, 2017

Swapping gulp out for a small webpack setup. A much simpler page with [Conways' Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) displayed on a full-page canvas in the background.

### Version 3.3.0 - November 13 2014

Adding content for [deefour/interactor](https://github.com/deefour/interactor) and [deefour/authorizer](https://github.com/deefour/authorizer). Rewriting `gulpfile.js`.

### Version 3.2.0 - May 9 2014

Added content for [`Deefour\Aide`](https://github.com/deefour/aide).

### Version 3.1.0 - March 30 2014

Adding `.env` support to allow variable replacement via [Lo-Dash](http://lodash.com/) templates.

### Version 3.0.2 - March 9 2014

Responsive CSS.

### Version 3.0.1 - March 9 2014

IE9 Support. Modernizr added.

### Version 3.0.0 - March 9 2014

Changing build tool to gulp. New design.

### Version 2.0.0 - August 12 2013

Removing a lot of dependencies. Simplified the design.

### Version 1.0.0 - November 09 2012

Initial project release
