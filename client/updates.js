'use strict';

//var mongoConnector = require('mongodb').MongoClient;
var pubsub = require('../../server/pubsub.js');
var loopback = require('loopback');

var DataSource = require('loopback-datasource-juggler').DataSource;
//var mongoConnector = require('loopback-connector-mongodb').MongoClient;

var app = module.exports = loopback();

// var ds = loopback.createDataSource(mongoConnector, {
//   connector: 'mongodb',
//   url: 'mongodb://52.15.83.203:27019/?readConcern=secondaryPreferred',
//   host: '52.15.83.203',
//   port: '27019',
//   database: 'well-mark-dash-board-dev',
//   username: ''
// });

var url = 'mongodb://52.15.83.203:27019/?readConcern=secondaryPreferred';

const matchStage = {};

//mongoConnector.connect(url, (err, client) => {
// ds.connect((client) => {

console.log(app.dataSources);


app.dataSources.mongods.connect(function(err,db) {
  console.log('connected');
 // if (err) throw err;

// console.log(ds);
  //var coll = ds.db('well-mark-dash-board-dev').collection('slaMetrics');
  var coll = db.collection('slaMetrics');
  console.log(coll);

  // var filter = {
  //   $match: {
  //     $or: [{operationType: 'update'}, {operationType: 'replace'}],
  //     'fullDocument.month_id': 'false',
  //   },
  // };

  var cursor = coll.aggregate([
    {$changeStream: {fullDocument: 'updateLookup'}},
    {$match: {operationType: {$in: ['update', 'replace']}}},
  ]);

  console.log(cursor);
  cursor.each(function(err, doc) {
  // console.log(err);
  // console.log(doc);

  // console.log(JSON.stringify(doc.fullDocument));
    var socket = app.io;
    pubsub.publish(socket, {
      collectionName: 'slaMetrics',
      data: 'hello',
      method: 'update',
    });

    console.log(JSON.stringify(doc.updateDescription));
  });
});
