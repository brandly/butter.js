var
gulp = require('gulp'),
gutil = require('gulp-util'),
autoprefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
minify = require('gulp-minify-css'),
path = require('path'),
express = require('express'),

build = gutil.env.gh ? './gh-pages/' : './build/',
uglify = gutil.env.gh ? uglify : gutil.noop,
minify = gutil.env.gh ? minify : gutil.noop;

function onError(err) {
  gutil.log(err);
  gutil.beep();
  this.emit('end');
}

gulp.task('demo:static', function () {
  return gulp.src(['demo/*', '!demo/*.css'])
    .pipe(gulp.dest(build));
});

gulp.task('demo:css', function () {
  return gulp.src('demo/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minify())
    .pipe(gulp.dest(build));
});

gulp.task('demo:js', function () {
  return gulp.src('demo/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(build));
});

gulp.task('butter', function () {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(build));
});

gulp.task('build', [
  'demo:static',
  'demo:css',
  'demo:js',
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
