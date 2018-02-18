const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const jimp = require('jimp');

// import config file
const config = require('./config.json');

console.log(`processing ${chalk.blue('images')}\n`);

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

          console.log(`${chalk.green(file.output)} image processed\n`);
        })
        .catch((error) => {
          console.log(chalk.red(error));
        });
    });
  }
});
