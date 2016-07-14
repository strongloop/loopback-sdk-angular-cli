// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var app = loopback();

app.set('restApiRoot', '/rest-api-root');

app.dataSource('db', { connector: 'memory' });
var TestModel = app.registry.createModel(
    'TestModel',
    { foobaz: 'string' }
);
app.model(TestModel, { dataSource: 'db' });

// this is a hack to give the angular SDK a model to export
// TODO: find out why the model created above is not
//       returned by the rest adapter
var TestClass = {
    name: 'TestModel',
    sharedClass: {
        ctor: {
            settings: {
                description: 'Test Class',
            },
        },
    },
    ctor: {
        getFullPath: function() {}
    },
    methods: [],
};

app.handler('rest').adapter.getClasses = function() {
    return [TestClass];
};

module.exports = app;
