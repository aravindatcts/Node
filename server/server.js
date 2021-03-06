'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

boot(app, __dirname);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  //app.start();
  app.io = require('socket.io')(app.start());
  app.io.on('connection', function(socket){
  	socket.on('chatm', function(msg){
    	console.log('message: ' + msg);
    	app.io.emit('chatr', msg);
  	});
  	socket.on('disconnect', function(){
  		console.log('user disconnected');
  	});
  });
}


// app.start = function() {
//   // start the web server
//   return app.listen(function() {
//     app.emit('started');
//     app.io = require('socket.io')(app.start());
//     var baseUrl = app.get('url').replace(/\/$/, '');
//     console.log('Web server listening at: %s', baseUrl);
//     if (app.get('loopback-component-explorer')) {
//       var explorerPath = app.get('loopback-component-explorer').mountPath;
//       console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
//     }

//     app.io.on('connection', function(socket){
//       console.log('a user connected');
//       socket.on('disconnect', function(){
//         console.log('user disconnected');
//       });
//     });
//   });
// };

// // Bootstrap the application, configure models, datasources and middleware.
// // Sub-apps like REST API are mounted via boot scripts.
// boot(app, __dirname, function(err) {
//   if (err) throw err;

//   // start the server if `$ node server.js`
//   if (require.main === module)
//     app.start();
// });
