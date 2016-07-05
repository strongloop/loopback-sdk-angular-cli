// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var loopback = require('loopback');
var app = loopback();

app.set('restApiRoot', '/rest-api-root');

// this is a hack to give the angular SDK a model to export
// TODO: create and inject a model the "proper" way
var TestClass = {
    name: 'TestClass',
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

app.models.TestClass = {
    definition: {
        properties: {
            name: 'string',
        },
    },
};

app.handler('rest').adapter.getClasses = function() {
    return [TestClass];
};

module.exports = app;
