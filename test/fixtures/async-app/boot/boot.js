// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-sdk-angular-cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
'use strict';

module.exports = function(app, done) {
  process.nextTick(function() {
    var MyModel = app.registry.createModel('ASYNCMODEL', {});
    app.model(MyModel, {public: true});

    done();
  });
};
