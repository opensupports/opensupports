'use strict';

var config  = require('../config');
var gulp    = require('gulp');
var connect = require('gulp-connect-php');

gulp.task('serverphp', function() {
    connect.server(config.phpserver);
});