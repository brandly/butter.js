var
gulp = require('gulp'),
gutil = require('gulp-util'),
autoprefixer = require('gulp-autoprefixer'),
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
  return gulp.src(['demo/*', '!demo/style.css'])
    .pipe(gulp.dest(build));
});

gulp.task('css', function () {
  return gulp.src('demo/style.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(build));
});

gulp.task('butter', function () {
  return gulp.src('src/*.js')
    .pipe(gulp.dest(build));
});

gulp.task('build', [
  'demo',
  'css',
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
