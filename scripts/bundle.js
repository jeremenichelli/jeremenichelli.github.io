const mkdirp = require('mkdirp');
const chalk = require('chalk');

// rollup pacakges
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

// import config file
const config = require('./config.json');

const ENVIRONMENT = process.env.NODE_ENV || 'production';

console.log(`generating bundles for ${chalk.blue(ENVIRONMENT)}\n`);

// base input config for bundles
const baseConfig = {
  plugins: [
    // replace environment
    replace({
      __DEV__: ENVIRONMENT === 'production' ? 'false' : 'true'
    }),
    // resolve node modules
    resolve(),
    // support commonjs
    commonjs({
      include: 'node_modules/**'
    })
  ]
};

if (ENVIRONMENT === 'production') {
  // uglify bundle for production
  baseConfig.plugins.push(
    uglify({
      mangle: true,
      compress: {
        dead_code: true,
        passes: 2
      }
    })
  );
}

async function build() {

  const bundles = config.bundles.map(b => {
    // rollup all bundles in config file
    return rollup.rollup(Object.assign({}, { input: b.input }, baseConfig));
  });

  // write output bundles
  Promise.all(bundles)
    .then((results) => {

      results.map((b, index) => {
        const output = config.bundles[ index ].output;

        b.write({
          file: output,
          format: 'iife',
          sourcemap: ENVIRONMENT === 'development' ? 'inline' : false
        });

        console.log(`${chalk.green(output)} file written`);
      });
    });
}

// bundle files
build();
