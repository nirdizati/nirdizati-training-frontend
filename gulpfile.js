'use strict';

var gulp = require('gulp');
// var connect = require('gulp-connect');

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

// gulp.task('default', ['clean'], function () {
//     gulp.start('build');
// });

gulp.task('default', ['clean', 'serve']);

// gulp.task('serveprod', function() {
  // connect.server({
  //   port: process.env.PORT || 8090, // localhost:5000
  //   livereload: false
  // });
// });
