const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');
const chalk = require('chalk');

const uglify = require('uglify-js');
const config = require('./config.json');

const dev = process.env.NODE_ENV === 'development';

/**
 * Concats all JS files
 * @method concatJS
 * @param {String} type
 */
function concatJS(type) {
  // create base output directory
  mkdirp(path.dirname(config.js[ type ].output), (error) => {
    if (!error) {
      glob(
        config.js[ type ].entry,
        (error, files) => {
          if (!error) {
            let content = '';

            // concat files content
            files.map((file) => {
              content += fs.readFileSync(file).toString();
            });

            const uglified = uglify.minify(content, {
              mangle: !dev,
              compress: dev ? false : {
                dead_code: true,
                global_defs: {
                  DEV: false
                },
                passes: 2
              },
              output: {
                beautify: dev,
                preamble: dev ? 'window.DEV = true;' : ''
              }
            });

            if (uglified.error !== undefined) {
              return console.log(chalk.red(`${uglified.error}\n`));
            }

            fs.writeFile(config.js[ type ].output, uglified.code, 'UTF-8');

            // log
            console.log(chalk.green(`${type} javascript files written\n`));
          }
        }
      );
    } else {
      console.log(chalk.red(`${error}\n`));
    }
  });
}

// process critical JS files
concatJS('critical');

// process noncritical JS files
concatJS('noncritical');
