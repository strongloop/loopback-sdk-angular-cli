// Copyright IBM Corp. 2014,2018. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var loopback = require('loopback');
var app = loopback();

app.dataSource('db', {connector: 'memory'});
app.set('restApiRoot', '/rest-api-root');

var TestModel = app.registry.createModel(
  'TestModel',
  {foobaz: 'string'}
);
app.model(TestModel, {dataSource: 'db'});

module.exports = app;
