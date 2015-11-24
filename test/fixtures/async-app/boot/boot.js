var loopback = require('loopback');

module.exports = function (app, done) {
   setTimeout(function () {
     var MyModel = loopback.createModel('ASYNCMODEL', {});
     app.model(MyModel, { public: true, dataSource: 'db' });

     done();
   }, 1500);
};
