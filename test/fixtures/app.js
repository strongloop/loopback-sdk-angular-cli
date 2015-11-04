var loopback = require('loopback');
var app = loopback();

// Listen on an ephemeral port
app.set('port', 0);

// Setup default datasources for autoAttach()
app.dataSource('db', { connector: 'memory', defaultForType: 'db' });
app.dataSource('mail', { connector: 'mail', defaultForType: 'mail' });

// Attach all built-in models
loopback.autoAttach();


// Configure REST API path
app.set('restApiRoot', '/api-root');
app.set('host', '0.0.0.0');
app.set('port', '3003');

module.exports = app;
