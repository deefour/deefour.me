var gulp      = require('gulp');
var compass   = require('gulp-compass');
var uglify    = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var gutil     = require('gulp-util');
var htmlmin   = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');



var paths = {
  styles:  [ 'app/assets/**/*.scss' ],
  images:  [ 'app/assets/**/*.{png,gif,jpg,jpeg}' ],
  scripts: [ 'app/assets/**/*.js' ],
  html:    [ 'app/**/*.html' ],
  statics: [ 'app/**/*.{txt,pub}' ]
};



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
      .pipe(htmlmin({collapseWhitespace: true}))
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



gulp.task('default', ['scripts', 'styles', 'html', 'images', 'statics']);