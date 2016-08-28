var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var glob = require('glob');
var chalk = require('chalk');

var uglify = require('uglify-js');
var config = require('./config.json');
var timestamps = require('./timestamps.js');

var dev = process.argv[2] === '--dev';

/**
 * Concats all JS files
 * @method concatJS
 * @param {String} type
 */
function concatJS(type) {
  // create base output directory
  mkdirp(path.dirname(config.js[ type ].output), function(error) {
    if (!error) {
      glob(config.js[ type ].entry,
        function(error, files) {
          if (!error) {
            var content = '';
            // concat files content
            files.map(function(file) {
              content += fs.readFileSync(file).toString();
            });

            // uglify
            if (!dev) {
              content = uglify.minify(content, { fromString: true }).code;
            }

            // write concat file
            fs.writeFile(config.js[ type ].output, content, 'UTF-8');

            // log
            console.log(chalk.green('>>> ') + chalk.magenta(config.js[ type ].output));
          }
        });
    } else {
      console.log(chalk.red(error));
    }
  });
}

// process critical LESS files
concatJS('critical');

// process noncritical LESS files
concatJS('noncritical');

if (!dev) {
  // update timestamps for styles
  timestamps.update('scripts');
}
