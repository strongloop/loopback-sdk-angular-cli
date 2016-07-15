// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var app = loopback();

// model creation is added so output has enough content to reproduce
// issue where node v6 to chunk output of child_process and
// nextTick exit before finish writing (see PR #45)
app.dataSource('db', { connector: 'memory' });
var User = loopback.createModel('User');
app.model(User, { dataSource: 'db' });

app.set('restApiRoot', '/rest-api-root');

module.exports = app;
