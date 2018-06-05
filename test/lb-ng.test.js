// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
'use strict';

var extend = require('util')._extend;
var fs = require('fs.extra');
var path = require('path');
var Promise = require('bluebird');
var exec = Promise.promisify(require('child_process').exec);
var debug = require('debug')('test');
var parse = require('loopback-sdk-angular/parse-helper');

var chai = require('chai');
chai.use(require('dirty-chai'));
var expect = chai.expect;

describe('lb-ng', function() {
  var sampleAppJs = require.resolve('./fixtures/app.js');
  var sampleAsyncAppJs = require.resolve('./fixtures/async-app/app.js');
  var SANDBOX = path.resolve(__dirname, 'sandbox');

  beforeEach(resetSandbox);

  it('prints help on no arguments', function() {
    return runLbNg()
      .then(function() {
        throw new Error('lb-ng was supposed to fail with non-zero exit code');
      })
      .catch(function(err) {
        expect(err.code, 'exit code').to.equal(1);
        expect(err.message).to.contain('Usage');
      });
  });

  it('generates "lbServices" module with app.restApiRoot url',
    function() {
      return runLbNg(sampleAppJs).spread(function(script, stderr) {
        // the value "lbServices" is the --module-name default
        expect(parse.moduleName(script)).to.equal('lbServices');
        // the value "/rest-api-root" is hard-coded in sampleAppJs
        expect(parse.baseUrl(script)).to.equal('/rest-api-root');
      });
    });

  it('uses the module name from command-line', function() {
    return runLbNg('-m', 'a-module-name', sampleAppJs)
      .spread(function(script, stderr) {
        expect(parse.moduleName(script)).to.equal('a-module-name');
      });
  });

  it('uses the namespacing common modules from command-line', function() {
    return runLbNg('-c', 'true', '-d', '_', sampleAppJs)
      .spread(function(script, stderr) {
        expect(script).to.match(/lbServices_Resource/);
      });
  });

  it('uses the url from command-line', function() {
    return runLbNg('-u', 'http://foo/bar', sampleAppJs)
      .spread(function(script, stderr) {
        expect(parse.baseUrl(script)).to.equal('http://foo/bar');
      });
  });

  it('passes the include-schema flag from the command-line', function() {
    var outfile = path.resolve(SANDBOX, 'lb-services.js');
    return runLbNg('-s', sampleAppJs, outfile)
      .spread(function() {
        var script = fs.readFileSync(outfile);
        expect(script).to.match(/R\.schema =/);
        expect(script).to.match(/schema of the model/);
      });
  });

  it('saves the script to a file', function() {
    var outfile = path.resolve(SANDBOX, 'lb-services.js');
    return runLbNg('-m', 'a-module', sampleAppJs, outfile)
      .spread(function(stdout, stderr) {
        var script = fs.readFileSync(outfile);
        expect(parse.moduleName(script)).to.equal('a-module');
        expect(stdout).to.equal('');
      });
  });

  it('supports async booting apps', function() {
    return runLbNg(sampleAsyncAppJs).spread(function(script, stderr) {
      expect(
        script.match(/[\n\s]*module\.factory\([\s\n]*"ASYNCMODEL"/),
        'presence of late-initialized model'
      ).to.be.ok();
    });
  });

  // -- Helpers --

  function runLbNg() {
    // empty object for env so it does not inherit env-vars from parent process
    // this avoids debug messages affecting the stdout
    var options = {env: {}};
    var argv = [process.execPath, require.resolve('../bin/lb-ng')]
      .concat(Array.prototype.slice.call(arguments))
      .map(JSON.stringify)
      .join(' ');
    debug('--EXECFILE[%s]--', argv);
    return exec(argv, options)
      .then(function(args) {
        debug('--STDOUT--\n%s\n--STDERR--\n%s\n--END--', args[0], args[1]);
        return args;
      })
      .catch(Promise.RejectionError, function(err) {
        debug('--FAILED--\n%s--END--', err.cause.stack);
        throw err.cause;
      });
  }

  function resetSandbox() {
    fs.rmrfSync(SANDBOX);
    fs.mkdirSync(SANDBOX);
  }
});
