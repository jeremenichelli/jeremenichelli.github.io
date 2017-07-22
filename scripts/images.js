var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var glob = require('glob');
var chalk = require('chalk');

var jimp = require('jimp');
var config = require('./config.json');

// create base output directory
mkdirp(config.images.output, (error) => {
  if (!error) {
    glob(
      config.images.entry,
      (error, files) => {
        if (!error) {
          files.map((file) => {
            jimp.read(file)
              .then((image) => {
                image
                  .quality(90)
                  .resize(240, 240)
                  .write(config.images.output + path.basename(file));

                // log
                console.log(chalk.green(`${file} image processed\n`));
              });
          });
        }
      }
    );
  }
});
