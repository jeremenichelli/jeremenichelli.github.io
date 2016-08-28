var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var glob = require('glob');
var chalk = require('chalk');

var config = require('./config.json');
var timestamps = require('./timestamps.js');
var less = require('less');
var cleanCSSPlugin = require('less-plugin-clean-css');

var cleanCSS = new cleanCSSPlugin({ advanced: true });

/**
 * Creates output directory and transform LESS files
 * @method convertLESS
 * @param {String} type
 */
function convertLESS(type) {
  // create base output directory
  mkdirp(config.less[type].output, function(error) {
    if (!error) {
      glob(config.less[type].entry,
        function(error, files) {
          if (!error) {
            var transformFn = type === 'critical' ? toHTML : toCSS;
            // transform file
            files.map(function(file) {
              transformFn(file)
            });
          }
        });
    } else {
      console.log(chalk.red(error));
    }
  });
}

/**
 * Read, process a LESS file and write to CSS file
 * @method toCSS
 * @param {String} file
 */
function toCSS(file) {
  // read less file
  fs.readFile(file, 'UTF-8', function(error, content) {
    if (!error) {
      var options = {
        compress: true,
        paths: [ path.dirname(file) ],
        plugins: [ cleanCSS ]
      }
      var output =
        config.less.noncritical.output +
        path.basename(file)
          .replace('noncritical--', '')
          .replace('.less', '.css');
      // process less file
      less
        .render(content, options)
        .then(function(result) {
          fs.writeFile(output, result.css, 'UTF-8');
          // log
          console.log(chalk.green('>>> ') + chalk.magenta(output));
        }, function(error) {
          console.log(chalk.red(error));
        });
    }
  });
}

/**
 * Read, process a LESS file and write to HTML include file
 * @method toCSS
 * @param {String} file
 */
function toHTML(file) {
  // read less file
  fs.readFile(file, 'UTF-8', function(error, content) {
    if (!error) {
      var options = {
        paths: [ path.dirname(file) ],
        plugins: [ cleanCSS ]
      }
      var output =
        config.less.critical.output +
        path.basename(file)
          .replace('.less', '.html');
      // process less file
      less
        .render(content, options)
        .then(function(result) {
          fs.writeFile(output, result.css, 'UTF-8');
          // log
          console.log(chalk.green('>>> ') + chalk.magenta(output));
        }, function(error) {
          console.log(chalk.red(error));
        });
    }
  });
}

// process critical LESS files
convertLESS('critical');

// process noncritical LESS files
convertLESS('noncritical');

// update timestamps for styles
timestamps.update('styles');
