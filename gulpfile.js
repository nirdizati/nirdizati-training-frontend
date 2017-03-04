'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect');
 
gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    host:'0.0.0.0',
    port:'8090'
  });
});
 
gulp.task('default', ['webserver']);
