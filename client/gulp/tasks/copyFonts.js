'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyFonts', function() {

  gulp.src(config.sourceDir + 'fonts/**/*').pipe(gulp.dest(config.buildDir + 'fonts/'));

});