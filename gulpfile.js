// Deps
var compass   = require('gulp-compass');
var fs        = require('fs');
var gulp      = require('gulp');
var gutil     = require('gulp-util');
var htmlmin   = require('gulp-htmlmin');
var imagemin  = require('gulp-imagemin');
var ini       = require('ini');
var minifyCSS = require('gulp-minify-css');
var template  = require('gulp-template');
var uglify    = require('gulp-uglify');



// Setup
var env   = ini.parse(fs.readFileSync('./.env', 'utf-8'));
var paths = {
  styles:  [ 'app/assets/**/*.scss' ],
  images:  [ 'app/assets/**/*.{png,gif,jpg,jpeg}' ],
  scripts: [ 'app/assets/**/*.js' ],
  html:    [ 'app/**/*.html' ],
  statics: [ 'app/**/*.{txt,pub}' ]
};



// Tasks
gulp.task('statics', function () {
    gulp.src(paths.statics)
        .pipe(gulp.dest('public'));
});

gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest('public'));
});

gulp.task('html', function() {
  gulp.src(paths.html)
      .pipe(template({ env: env }, { interpolate: /{{([\s\S]+?)}}/g }))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('public'))
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
      .pipe(uglify())
      .pipe(gulp.dest('public'))
});

gulp.task('styles', function() {
  gulp.src(paths.styles)
      .pipe(compass({
        sass: 'app/assets',
        css: 'public',
        require: [ 'compass-normalize' ],
        bundle_exec: true
      }))
      .pipe(gutil.env.type === 'production' ? minifyCSS() : gutil.noop())
      .pipe(gulp.dest('public'));
});



// Default Task
gulp.task('default', [ 'scripts', 'styles', 'html', 'images', 'statics' ]);
