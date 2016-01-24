'use strict';

const gulp = require('gulp');
const plugins = require( 'gulp-load-plugins' )();
const stylish = require('jshint-stylish');
const isparta = require('isparta');
const del = require('del');

const TESTS = [
  // 'test/core/test-*.js',
  // 'test/db/test-*.js',
  // 'test/util/test-*.js',
  // 'test/auth/test-*.js',
  // 'test/ws/test-*.js',
  // 'test/ws/util/test-*.js',
  // 'test/ravel/test-*.js',
  // 'test/**/test-*.js'
  'test/test-next.js'
];

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js', './test/**/*.js', 'gulpfile.js'])
             .pipe(plugins.jshint())
             .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('docco', function() {
  return gulp.src(['./lib/**/*.js'])
             .pipe(plugins.docco({
               layout: 'parallel'
             }))
             .pipe(gulp.dest('./docs'));
});

gulp.task('clean', function() {
  return del([
    'reports', 'docs'
  ]);
});

gulp.task('cover', ['lint'], function() {
  return gulp.src(['./lib/**/*.js'])
             .pipe(plugins.istanbul({
               instrumenter: isparta.Instrumenter,
               includeUntested: true
             }))
             .pipe(plugins.istanbul.hookRequire());
});

gulp.task('test', ['cover'], function () {
  const env = plugins.env.set({
    LOG_LEVEL : 'critical'
  });
  return gulp.src(TESTS)
    .pipe(env)
    .pipe(plugins.mocha({
      reporter: 'spec',
      quiet:false,
      colors:true,
      timeout: 10000
    }))
    // Creating the reports after tests ran
    .pipe(plugins.istanbul.writeReports({
      dir: './reports',
      reporters: [ 'lcov', 'json', 'text', 'text-summary', 'html']
    }))
    // Enforce a coverage of at least 90%
    .pipe(plugins.istanbul.enforceThresholds({ thresholds: { global: 100 } }))
    .pipe(env.reset);
});

gulp.task('watch', function() {
  gulp.watch(['./lib/**/*.js'], ['lint']);
  gulp.watch(['gulpfile.js', './test/**/*.js'], ['lint']);
});


gulp.task('coveralls', ['test'], function() {
  return gulp.src('reports/lcov.info')
             .pipe(plugins.coveralls());
});

gulp.task('show-coverage', ['test'], function() {
  return gulp.src('./reports/ravels.html')
             .pipe(plugins.open());
});

gulp.task('show-docs', ['docco'], function() {
  return gulp.src('./docs/index.html')
             .pipe(plugins.open());
});

gulp.task('default', ['lint', 'watch']);
gulp.task('travis', ['coveralls']);
//
// gulp.task('debug', () => {
//   const envs = plugins.env.set({
//     NODE_ENV: 'debug'
//   });
//   return gulp.src('src/main.js')
//     .pipe(envs)
//     .pipe(babel({optional: [
//       'utility.inlineEnvironmentVariables'
//     ]}))
//     .pipe(uglify())
//     .pipe(transform(file => browserify(file).bundle()))
//     .pipe(envs.reset)
//     .pipe(gulp.dest('dist'));
// });