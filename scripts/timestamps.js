var fs = require('fs');
var chalk = require('chalk');

var updateTimestamp = function(stamp) {
  var timestamps = {}

  fs.readFile('./_data/timestamps.json', 'UTF-8', function(error, content) {
    if (!error) {
      timestamps = JSON.parse(content);

      // update stamp date number
      timestamps[ stamp ] = Date.now();

      // save json file
      fs.writeFile('./_data/timestamps.json', JSON.stringify(timestamps, null, 2));

      // log
      console.log('\nUpdate timestamps for ' + chalk.green(stamp) + '\n');
    } else {
      console.log(chalk.red(error));
    }
  });
}

module.exports = {
  update: updateTimestamp
};
