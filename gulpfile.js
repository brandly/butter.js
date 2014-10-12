var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
uglify = require('gulp-uglify'),
minify = require('gulp-minify-css'),
path = require('path'),
express = require('express'),

build = gutil.env.gh ? './gh-pages/' : './build/';

function onError(err) {
  gutil.log(err);
  gutil.beep();
  this.emit('end');
}

gulp.task('demo', function () {
  return gulp.src('demo/*')
    .pipe(gulp.dest(build));
});

gulp.task('butter', function () {
  return gulp.src('src/butter.js')
    .pipe(gulp.dest(build));
});

gulp.task('build', [
  'demo',
  'butter'
]);

gulp.task('default', ['build'], function () {
  if (!gutil.env.gh) {
    gulp.watch(['src/**', 'demo/**'], ['build']);

    var
    app = express(),
    port = 8888;
    app.use(express.static(path.resolve(build)));
    app.listen(port, function() {
      gutil.log('Listening on', port);
    });
  }
});
