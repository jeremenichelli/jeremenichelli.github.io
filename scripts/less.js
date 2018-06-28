const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');
const chalk = require('chalk');

// style processing modules
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// import config file
const config = require('./config.json');

console.log(`processing ${chalk.blue('styles')}\n`);

function processLESS() {
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

// process with postcss and export as include files
function toHTML(file) {
  // read less file
  fs.readFile(file, 'UTF-8', (error, content) => {
    if (!error) {
      const options = {
        paths: [ path.dirname(file) ]
      }

      const filename = `_styles-${ path.basename(file).replace('.less', '.html') }`
      const output = config.less.output + filename

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

              fs.writeFile(output, result.css, 'UTF-8', function() {
                console.log(`${chalk.green(output)} file written`);
              });
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
