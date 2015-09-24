'use strict';

module.exports = {

  'serverport': 3000,

  'scripts': {
    'src': './src/**/*.js',
    'dest': './build/js/'
  },

  'phpserver': {
    'base': './src/server/',
    'port': 8000
  },

  'images': {
    'src': './src/assets/images/**/*.{jpeg,jpg,png}',
    'dest': './build/images/'
  },

  'styles': {
    'src': './src/**/*.scss',
    'dest': './build/css/'
  },

  'sourceDir': './src/',

  'buildDir': './build/'

};