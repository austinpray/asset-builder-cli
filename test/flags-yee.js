'use strict';

var chai       = require('chai');
var expect     = require('chai').expect;
var child      = require('child_process');

describe('flag: --YEE', function() {
  it(
    'should print "yee"',
    function(done) {
      child.exec(
        'node ' +
        __dirname +
        '/../bin/asset-builder-cli.js --YEE --cwd ./test',
        function(err, stdout) {
          expect(stdout).to.contain('yee');
          done(err);
        }
      );
    }
  );
});
