'use strict';

var chai       = require('chai');
var assert     = chai.assert;
var expect     = require('chai').expect;
var child      = require('child_process');
var cliVersion = require('../package.json').version;
var abVersion  = require('asset-builder/package.json').version;

describe('flag: --version and -v', function() {
  it(
    'should print the version of CLI and local asset-builder for --version',
    function(done) {
      child.exec(
        'node ' +
        __dirname +
        '/../bin/asset-builder-cli.js --version --cwd ./test',
        function(err, stdout) {
          expect(stdout).to.contain('cli version: ' + cliVersion);
          expect(stdout).to.contain('local asset-builder: ' + abVersion);
          done(err);
        }
      );
    }
  );
  it(
    'should print the version of CLI and local asset-builder for -v',
    function(done) {
      child.exec(
        'node ' +
        __dirname +
        '/../bin/asset-builder-cli.js -v --cwd ./test',
        function(err, stdout) {
          expect(stdout).to.contain('cli version: ' + cliVersion);
          expect(stdout).to.contain('local asset-builder: ' + abVersion);
          done(err);
        }
      );
    }
  );
});
