'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyIndex', function() {

  gulp.src(config.sourceDir + 'index.html').pipe(gulp.dest(config.buildDir));
  gulp.src(config.sourceDir + 'index.php').pipe(gulp.dest(config.buildDir));
  gulp.src(config.sourceDir + '.htaccess').pipe(gulp.dest(config.buildDir));

});