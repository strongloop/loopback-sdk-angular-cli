// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var app = loopback();

app.set('restApiRoot', '/rest-api-root');

module.exports = app;
