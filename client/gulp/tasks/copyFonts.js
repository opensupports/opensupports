'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyFonts', function() {

  return gulp.src(config.fonts.src)
      .pipe(gulp.dest(config.fonts.dest))
});