var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

var favicons = require('favicons');
var config = require('./config.json');
var timestamps = require('./timestamps.js');

var setup = {
  background: '#ffffff',
  path: config.favicon.path,
  online: false,
    icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    coast: false,
    favicons: true,
    firefox: true,
    windows: true,
    yandex: true
  }
};

// create output directory
mkdirp(config.favicon.output, function(error) {
  if (!error) {
    // generate favicons
    favicons(config.favicon.entry, setup, function(error, response) {
      if (error) {
        console.log(error);
      } else {
        // output html tags
        fs.writeFile(config.favicon.html, response.html.join('\n'), 'UTF-8');

        // write favicon files
        response.files.map(function(file) {
          fs.writeFile(config.favicon.output + file.name, file.contents, 'UTF-8');
          // log
          console.log(chalk.green('>>> ') + chalk.magenta(file.name));
        });

        // write favicon images
        response.images.map(function(image) {
          fs.writeFile(config.favicon.output + image.name, image.contents, 'UTF-8');
          // log
          console.log(chalk.green('>>> ') + chalk.magenta(image.name));
        })
      }
    });

  }
});
