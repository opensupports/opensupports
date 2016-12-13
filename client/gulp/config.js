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

  'fonts': {
    'src': './src/scss/font_awesome/fonts/*',
    'dest': './build/fonts/'
  },

  'sourceDir': './src/',

  'buildDir': './build/'

};
