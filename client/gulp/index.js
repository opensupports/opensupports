'use strict';

var fs = require('fs');
var onlyScripts = require('./util/script-filter');
var tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

process.env.NODE_PATH = './src';

tasks.forEach(function(task) {
  require('./tasks/' + task);
});