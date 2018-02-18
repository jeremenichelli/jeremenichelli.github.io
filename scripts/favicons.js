const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const chalk = require('chalk');
const favicons = require('favicons');

// import config file
const config = require('./config.json');

console.log(`running ${chalk.blue('favicon')} tasks\n`);

const setup = {
  appName: 'Jeremias Menichelli',
  appDescription: 'Personal site',
  developerName: 'Jeremias Menichelli',
  background: '#101010',
  path: config.favicon.path,
  online: false,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: true,
    coast: false,
    firefox: false,
    yandex: false
  }
};

// rmeove old favicon files
rimraf(config.favicon.output, (error) => {
  if (!error) {
    // create output directory
    mkdirp(config.favicon.output, (error) => {
      if (!error) {
        // generate favicons
        favicons(config.favicon.entry, setup, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            // output html tags
            fs.writeFile(
              config.favicon.html,
              response.html.join('\n'),
              'UTF-8',
              () => {
                console.log(`favicon ${chalk.magenta('html partial')} created`);
              }
            );

            // write favicon files
            response.files.map((file) => {
              fs.writeFile(
                config.favicon.output + file.name,
                file.contents,
                'UTF-8',
                () => {
                  console.log(`favicon ${chalk.magenta(file.name)} file created`);
                });
            });

            // write favicon images
            response.images.map((image) => {
              fs.writeFile(
                config.favicon.output + image.name,
                image.contents,
                'UTF-8',
                () => {
                  console.log(`favicon ${chalk.green(image.name)} image created`);
                }
              );
            });
          }
        });
      }
    });
  }
});
