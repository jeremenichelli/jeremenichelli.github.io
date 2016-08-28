var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var glob = require('glob');
var chalk = require('chalk');

var jimp = require('jimp');
var config = require('./config.json');
var timestamps = require('./timestamps.js');

// create base output directory
mkdirp(config.images.output, function(error) {
  if (!error) {
    glob(config.images.entry,
      function(error, files) {
        if (!error) {
          files.map(function(file) {
            jimp.read(file)
              .then(function(image) {
                image
                  .resize(250, 250)
                  .quality(80)
                  .write(config.images.output + path.basename(file));

                // log
                console.log(chalk.green('>>> ') + chalk.magenta(config.images.output + path.basename(file)));
              });
          });
        }
      });
  }
});

// update timestamps for styles
timestamps.update('images');
