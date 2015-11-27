var loopback = require('loopback');

module.exports = function (app, done) {
  process.nextTick(function () {
    var MyModel = loopback.createModel('ASYNCMODEL', {});
    app.model(MyModel, { public: true });

    done();
  });
};
