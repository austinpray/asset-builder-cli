var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');

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

module.exports = exports = function () {
  var assetbuilder = new Liftoff({
    name: 'assetbuilder',
    processTitle: 'assetbuilder',
    moduleName: 'asset-builder',
    configName: 'asset-builder'
  });
  var invoke = function (env) {
    // https://www.youtube.com/watch?v=q6EoRBvdVPQ
    if (argv.YEE) {
      console.log(chalk.green('yee'));
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

    if(!manifestPath) {
      console.log(chalk.red('You need to specify a manifest path.'));
      console.log(
        chalk.red('Try running:'),
        chalk.magenta('assetbuilder --manifest assets/manifest.json')
      );
      exit(1);
    }

    var manifest = require(env.modulePath)(manifestPath);

    var indent = '    ';

    Object.keys(manifest.globs).forEach(function(key) {
      var dep = manifest.globs[key];
      console.log(
        chalk.magenta(key)
      );
      if(key === 'js' || key === 'css') {
        dep.forEach(function(file) {
          console.log(
            indent,
            chalk.magenta(file.name)
          );
          file.globs.forEach(function(glob) {
            console.log(
              indent,
              chalk.blue(glob)
            );
          });
        });
      } else {
        dep.forEach(function(file) {
          console.log(
            indent,
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

}
