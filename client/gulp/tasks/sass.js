'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var gulpif       = require('gulp-if');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var bulkSass     = require('gulp-sass-bulk-import');
var plumber      = require('gulp-plumber');
var handleErrors = require('../util/handle-errors');
var config       = require('../config');

gulp.task('sass', function () {

  return gulp.src(config.styles.src)
	.pipe(bulkSass())
    .pipe(plumber())
    .pipe(sass({
      sourceComments: global.isProd ? 'none' : 'map',
      sourceMap: 'sass',
      outputStyle: global.isProd ? 'compressed' : 'nested'
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.styles.dest))
    .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));

});
