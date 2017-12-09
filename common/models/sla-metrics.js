'use strict';

var moment = require('moment');
var pubsub = require('../../server/pubsub.js');
var loopback = require('loopback');

//var app = module.exports = loopback();


//app.io = require('socket.io').listen();
module.exports = function(Slametrics) {

Slametrics.getLatestSlaMetrics = (month,lobname,cb) => {  

  if (!lobname.trim()){
      lobname = "Combined"
  }

   var filter = { 
       where : {'and': [
           { 'month_ind' : month},
          {'lob_name' : lobname}
       ],
       order: 'date DESC' }};


var coll = Slametrics.getDataSource().connector.collection('slaMetrics');

var cursor = coll.aggregate([
    { $changeStream: { fullDocument: 'updateLookup' } },
    { $match: { operationType: { $in: ['update', 'replace'] } } }
]);
 

cursor.each(function(err, doc) {
  let eventemitted = false;

  if(!eventemitted) {
    var socket = Slametrics.app.io;
    pubsub.publish(socket, {
      collectionName: 'slaMetrics',
      data: JSON.stringify(doc.updateDescription),
      method: 'update',
    });
    eventemitted = true;
  }

  });


  return Slametrics.findOne(filter).then(function(slametrics) {
      return slametrics;
    }).catch(function(err) {
      console.log(err);
    });
};


//Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data
  Slametrics.remoteMethod('getLatestSlaMetrics',{
      description: "Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data", 
      accepts : [
          {arg:'month',type:'Boolean'},
          {arg:'lobname',type:'String'},
      ],
      http: { 
          path : '/getLatestSlaMetrics',
          verb : 'get'
      },
      returns: {arg: 'slametrics', type:'object'}
  });


// Trend Metrics 

Slametrics.getTrendMetrics = (month,date,limit,cb) => {

  var nextDate = moment(date).add(1,'d').toDate();
   //Filter based on month Indicator and  sort it based on the latest date   
   var filter =   { 
       where :
           {'and': 
             [ {'month_ind' : month},
              { 'date': { lt: nextDate }},

           ]},
       order: 'date DESC',
       limit: limit
     };
 console.log(nextDate);

  return Slametrics.find(filter).then(function(slametrics) {

      return slametrics;
    }).catch(function(err) {
      console.log(err);
    });

};

 //Get the latest trend metrics for passed month_ind and date 
  Slametrics.remoteMethod('getTrendMetrics',{
      description: "Get the latest trend metrics for passed month_ind and date ", 
      accepts : [ 
          {arg:'month',type:'Boolean'},
          {arg:'date' ,type:'Date'},
          {arg:'limit', type: 'Number'}
      ],
      http: { 
          path : '/getTrendMetrics',
          verb : 'get'
      },
      returns: [{arg: 'slametrics', type:'Object'}]
  });



Slametrics.getMetricsForDate = (month,date,cb) => {

 var nextDate;
  if (month){
       
     nextDate = moment(date).add(1,'M').toDate();
     console.log(nextDate);
  } else 
  {
      nextDate = moment(date).add(1,'d').toDate();
  }

  console.log(nextDate);

   //Filter based on month Indicator and  sort it based on the latest date   
   var filter =   { 
       where :
           {'and': 
             [ {'month_ind' : month},
              { 'date': { between: [date,nextDate] }}
           ]}
     };

  return Slametrics.findOne(filter).then(function(slametrics) {

      return slametrics;
    }).catch(function(err) {
      console.log(err);
    });

};



 //Get Metrics for provided Date 
  Slametrics.remoteMethod('getMetricsForDate',{
      description: "Get metrics for provided Date ", 
      accepts : [ 
          {arg:'month',type:'Boolean'},
          {arg:'date' ,type:'Date'}
      ],
      http: { 
          path : '/getMetricsForDate',
          verb : 'get'
      },
      returns: [{arg: 'slametrics', type:'Object'}]
  });
  

Slametrics.getMetricsForSlaName = (month,slaName,lobName,date,cb) => {

 var nextDate;
  if (month){
       
     nextDate = moment(date).add(1,'M').toDate();
     console.log(nextDate);
  } else 
  {
      nextDate = moment(date).add(1,'d').toDate();
  }

   //Filter based on month Indicator and  sort it based on the latest date   
   var filter =   { 
       where :
           {'and': 
             [ {'month_ind' : month},
              {'lob_name' : lobName},
              { 'date': { between: [date,nextDate] }},
              { 'slalList.slaname': slaName  }
           ]}
     };

  return Slametrics.find(filter).then(function(slametrics) {
   let finalData = [];
     slametrics.forEach((slametric) => {
           let slaLists = slametric["slalList"];
           let lobname = slametric["lob_name"];
            let slaL =  slaLists.filter((sla) => { 
                    return (sla["slaname"] == slaName) ;
            } ) 
           
            let slaList =  {"lobname" : lobname,
                             "slaList":slaL
                            };
            finalData.push(slaList);                 
     });    

      return finalData;
    }).catch(function(err) {
      console.log(err);
    });
};


Slametrics.remoteMethod('getMetricsForSlaName',{
      description: "Get metrics for provided Date,SLANAME", 
      accepts : [ 
          {arg:'month',type:'Boolean'},
          {arg:'slaname',type:'String'},
          {arg: 'lobname', type:'String'},
          {arg:'date' ,type:'Date'}
      ],
      http: { 
          path : '/getMetricsForSlaName',
          verb : 'get'
      },
      returns: [{arg: 'slametrics', type:'Object'}]
  });  

  
Slametrics.getTrendsForSlaName = (month,slaName,limit,date,cb) => {


   var filter =   { 
       where :
           {'and': 
             [ {'month_ind' : month},
              { 'date': { lt: date }},
              { 'slalList.slaname': slaName  }
           ]},
       order: 'date DESC',
       limit: limit
     };

  return Slametrics.find(filter).then(function(slametrics) {

   let finalData = [];
    console.log(slametrics);
     slametrics.forEach((slametric) => {
           let slaDate = slametric["date"];
           let slaLists = slametric["slalList"];
           let lobname = slametric["lob_name"];
            let slaL =  slaLists.filter((sla) => { 
                    return (sla["slaname"] == slaName) ;
            } ) 
           
            let slaList =  {
                 "slaDate" : slaDate,
                 "lobname" : lobname,
                 "slaList":slaL
                 };
            finalData.push(slaList);                 
     });    

      return finalData;
    }).catch(function(err) {
      console.log(err);
    });
};

Slametrics.remoteMethod('getTrendsForSlaName',{
      description: "Get Trends for provided Date,SLANAME", 
      accepts : [ 
          {arg:'month',type:'Boolean'},
          {arg:'slaname',type:'String'},
          {arg:'limit' ,type:'Number'},
          {arg:'date' ,type:'Date'}
      ],
      http: { 
          path : '/getTrendsForSlaName',
          verb : 'get'
      },
      returns: [{arg: 'slametrics', type:'Object'}]
  });  


};
