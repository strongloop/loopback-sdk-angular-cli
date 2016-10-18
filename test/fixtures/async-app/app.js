// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = loopback();
boot(app, __dirname);

module.exports = app;
