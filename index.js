'use strict';

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var moduleInfo = require('./package.json');

// Fix stdout truncation on windows
function exit(code) {
  if (process.platform === 'win32' && process.stdout.bufferSize) {
    process.stdout.once('drain', function() {
      process.exit(code);
    });
    return;
  }
  process.exit(code);
}

module.exports = exports = function() {
  var assetbuilder = new Liftoff({
    name: 'assetbuilder',
    processTitle: 'assetbuilder',
    moduleName: 'asset-builder',
    configName: 'asset-builder'
  });
  var invoke = function(env) {
    // https://www.youtube.com/watch?v=q6EoRBvdVPQ
    if (argv.YEE) {
      console.log(chalk.green('yee'));
      exit(0);
    }

    if (argv.v || argv.version) {
      console.log('cli version:', moduleInfo.version);
      if (env.modulePackage && env.modulePackage.version) {
        console.log('local asset-builder:', env.modulePackage.version);
      }
      exit(0);
    }

    if (!env.modulePath) {
      console.log(
        chalk.red('Local asset-builder not found in'),
        chalk.magenta(env.cwd)
      );
      console.log(chalk.red('Try running: npm install asset-builder'));
      exit(1);
    }

    var config = {};
    if (env.configPath) {
      config = require(env.configPath);
    }

    var manifestPath = argv.m || argv.manifest || config.manifest;

    if (!manifestPath) {
      console.log(chalk.red('You need to specify a manifest path.'));
      console.log(
        chalk.red('Try running:'),
        chalk.magenta('assetbuilder --manifest assets/manifest.json')
      );
      exit(1);
    }

    var manifest = require(env.modulePath)(manifestPath);

    var indent = {
      l1: '  ',
      get l2() { return this.l1 + this.l1; }
    };

    Object.keys(manifest.globs).forEach(function(key) {
      var dep = manifest.globs[key];
      if (key === 'bower' && !argv['show-bower']) {
        return;
      }
      console.log(
        chalk.magenta(key)
      );
      if (key === 'js' || key === 'css') {
        dep.forEach(function(file) {
          console.log(
            indent.l1,
            chalk.magenta(file.name)
          );
          file.globs.forEach(function(glob) {
            console.log(
              indent.l2,
              chalk.blue(glob)
            );
          });
        });
      } else {
        dep.forEach(function(file) {
          console.log(
            indent.l1,
            chalk.blue(file)
          );
        });
      }
    });
  };

  assetbuilder.launch({
    cwd: argv.cwd,
    configPath: argv.myappfile,
    require: argv.require,
    completion: argv.completion
  }, invoke);

};
