'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var watching;

var paths = {
  lint: ['./gulpfile.js', './lib/**/*.js'],
  watch: ['./gulpfile.js', './index.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js']
};

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('istanbul', function (cb) {
  gulp.src(paths.source)
    .pipe(plugins.istanbul()) // Covering files
    .pipe(plugins.istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src(paths.tests, { cwd: __dirname })
        .pipe(plugins.plumber())
        .pipe(plugins.mocha())
        .on('error', function () {
          if (watching) {
            this.emit('end');
          } else {
            process.exit(1);
          }
        })
        .pipe(plugins.istanbul.writeReports()) // Creating the reports after tests runned
        .on('finish', function () {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('watch', function () {
  watching = true;

  gulp.run('test');
  gulp.watch(paths.watch, ['test']);
});

gulp.task('default', ['test']);