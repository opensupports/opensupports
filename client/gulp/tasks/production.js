'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

gulp.task('prod', ['clean'], function(callback) {
  process.env.NODE_ENV = 'production';
  
  callback = callback || function() {};

  global.isProd = true;

  runSequence(['sass', 'imagemin', 'browserify', 'copyFonts', 'copyIndex', 'copyIcons'], callback);

});
