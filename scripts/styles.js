const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');
const chalk = require('chalk');

const config = require('./config.json');
const less = require('less');
const cleanCSSPlugin = require('less-plugin-clean-css');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const cleanCSS = new cleanCSSPlugin({ advanced: true });

/**
 * Creates output directory and transform LESS files
 * @method convertLESS
 * @param {String} type
 */
function processLESS(type) {
  // create base output directory
  mkdirp(config.less.output, (error) => {
    if (!error) {
      glob(
        config.less.files,
        (error, files) => {
          if (!error) {
            // transform file
            files.map(toHTML);
          }
        }
      );
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
  fs.readFile(file, 'UTF-8', (error, content) => {
    if (!error) {
      const options = {
        paths: [ path.dirname(file) ]
      }

      const output =
        config.less.noncritical.output +
        path.basename(file)
          .replace('noncritical--', '')
          .replace('.less', '.css');

      // process less file
      less
        .render(content, options)
        .then((result) => {
          // autoprefix styles
          postcss([ autoprefixer, cssnano ])
            .process(result.css)
            .then((result) => {
              result.warnings().forEach((warn) => {
                console.log(chalk.yellow(warn.toString()));
              });
              fs.writeFile(output, result.css, 'UTF-8');
              console.log(chalk.green(`${output} style file written\n`));
            });
        }, function(error) {
          const errorMessage = `Error processing ${file} - line: ${error.line} column: ${error.column}\n\n${error.extract.join('\n')}\n`;

          console.log(chalk.red(errorMessage));
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
  fs.readFile(file, 'UTF-8', (error, content) => {
    if (!error) {
      const options = {
        paths: [ path.dirname(file) ]
      }

      const output =
        config.less.output +
        path.basename(file)
          .replace('.less', '--styles.html');

      less
        .render(content, options)
        .then((result) => {
          // autoprefix styles
          postcss([ autoprefixer, cssnano ])
            .process(result.css)
            .then((result) => {
              result.warnings().forEach((warn) => {
                console.log(chalk.yellow(warn.toString()));
              });
              fs.writeFile(output, result.css, 'UTF-8');
              console.log(chalk.green(`${output} style file written\n`));
            });
        }, function(error) {
          const errorMessage = `Error processing ${file} - line: ${error.line} column: ${error.column}\n\n${error.extract.join('\n')}\n`;

          console.log(chalk.red(errorMessage));
        });
      }
  });
}

// process LESS files
processLESS();
