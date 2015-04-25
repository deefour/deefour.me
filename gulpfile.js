'use strict';

// Dependencies
//
// -----------------------------------------------------------------------------

var gulp = require('gulp');
var del  = require('del');
var $    = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var fs   = require('fs');
var ini  = require('ini');



// Setup
var env   = ini.parse(fs.readFileSync('./.env', 'utf-8'));
var paths = {
  styles:  [ 'app/assets/**/*.scss' ],
  images:  [ 'app/assets/**/*.{png,gif,jpg,jpeg}' ],
  scripts: [ 'app/assets/**/*.js' ],
  html:    [ 'app/**/*.html' ],
  statics: [ 'app/**/*.{txt,pub}' ]
};



// Image minifcation (production only) and relocation
//
// -----------------------------------------------------------------------------
gulp.task('images', function () {
    gulp.src(paths.images)
    .pipe($.if(argv.production, $.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('public'))
    .pipe($.size());
});

gulp.task('html', function() {
  gulp.src(paths.html)
      .pipe($.template({ env: env }, { interpolate: /{{([\s\S]+?)}}/g }))
      .pipe($.if(argv.production, $.htmlmin({ collapseWhitespace: true })))
      .pipe(gulp.dest('public'))
});



// Javascript
//
// -----------------------------------------------------------------------------
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.if(argv.production, $.uglify()))
    .pipe(gulp.dest('public'))
    .pipe($.size());
});



// Stylesheets (Sass)
//
// -----------------------------------------------------------------------------
gulp.task('styles', function() {
  gulp.src(paths.styles)
    .pipe($.rubySass({
      style: 'nested',
      precision: 3,
      sourcemap: 'none',
      loadPath: [].concat.apply([], [
        require('node-bourbon').includePaths
      ])
    }))
    .pipe($.autoprefixer('last 5 versions', 'ie 9'))
    .pipe($.if(argv.production, $.csso()))
    .pipe(gulp.dest('public'))
    .pipe($.size());
});



// Extra static assets
//
// -----------------------------------------------------------------------------
gulp.task('statics', function () {
    gulp.src(paths.statics)
        .pipe(gulp.dest('public'));
});



// Cleanup from previous gulp runs
//
// -----------------------------------------------------------------------------
gulp.task('clean', function(cb) {
  del([
    'public/assets'
  ], cb);
});



// Default Task
gulp.task('default', [ 'clean', 'scripts', 'styles', 'html', 'images', 'statics' ]);
