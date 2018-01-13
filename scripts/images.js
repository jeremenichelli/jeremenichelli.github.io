var fs = require('fs');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var jimp = require('jimp');
var config = require('./config.json');

// create base output directory
mkdirp('./assets/images', (error) => {
  if (!error) {
    config.images.map((file) => {
      jimp
        .read(file.entry)
        .then((image) => {
          image
            .quality(file.quality)
            .resize(file.resize[ 0 ], file.resize[ 1 ])
            .write(file.output);

          console.log(chalk.green(`${file.output} image processed\n`));
        })
        .catch((error) => {
          console.log(chalk.red(error));
        });
    });
  }
});
