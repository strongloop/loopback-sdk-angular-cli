#!/usr/bin/env node
'use strict';

var path = require('path');
var SG = require('strong-globalize');
SG.SetRootDir(path.resolve(__dirname, '..'));
var g = SG();
var fs = require('fs');
var semver = require('semver');
var optimist = require('optimist');
var generator = require('loopback-sdk-angular');

var argv = optimist
  .usage(g.f(
    'Generate {{Angular $resource}} services ' +
    'for your {{LoopBack}} application.' +
    '\nUsage:' +
    '\n    $0 {{[options] server/app.js [client/js/lb-services.js]}}'))
  .describe('m', g.f('The name for generated {{Angular}} module.'))
  .default('m', 'lbServices')
  .describe('u', g.f('URL of the REST API end-point'))
  .describe('s', 'Include schema definition in generated models')
  .boolean('s')
  .alias({u: 'url', m: 'module-name', s: 'include-schema'})
  .demand(1)
  .argv;

var appFile = path.resolve(argv._[0]);
var outputFile = argv._[1];

g.error('Loading {{LoopBack}} app %j', appFile);
var app = require(appFile);
assertLoopBackVersion();

if (app.booting) {
  app.on('booted', runGenerator);
} else {
  runGenerator();
}

function runGenerator() {
  var ngModuleName = argv['module-name'] || 'lbServices';
  var apiUrl = argv['url'] || app.get('restApiRoot') || '/api';
  var includeSchema = argv['include-schema'] || false;

  g.error('Generating %j for the API endpoint %j', ngModuleName, apiUrl);
  var result = generator.services(app, {
    ngModuleName: ngModuleName,
    apiUrl: apiUrl,
    includeSchema: includeSchema,
  });

  if (outputFile) {
    outputFile = path.resolve(outputFile);
    g.error('Saving the generated services source to %j', outputFile);
    fs.writeFileSync(outputFile, result);
  } else {
    g.error('Dumping to {{stdout}}');
    process.stdout.write(result);
  }

  // The exit is deferred to the next tick in order to prevent the Node bug:
  // https://github.com/joyent/node/issues/3584
  process.nextTick(function() {
    process.exit();
  });
}

//--- helpers ---//

function assertLoopBackVersion() {
  var Module = require('module');

  // Load the 'loopback' module in the context of the app.js file,
  // usually from node_modules/loopback of the project of app.js
  var loopback = Module._load('loopback', Module._cache[appFile]);

  if (semver.lt(loopback.version, '1.6.0')) {
    g.error('\n' +
      'The code generator does not support applications based on\n' +
      '{{LoopBack}} versions older than 1.6.0. Please upgrade your project\n' +
      'to a recent version of {{LoopBack}} and run this tool again.\n');
    process.exit(1);
  }
}
