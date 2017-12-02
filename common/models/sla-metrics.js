'use strict';

var moment = require('moment');

module.exports = function(Slametrics) {

Slametrics.getLatestSlaMetrics = (month,cb) => {

   //Filter based on month Indicator and  sort it based on the latest date   
   var filter =   { 
       where : {month_ind : month},
       order: 'date DESC' };

  return Slametrics.findOne(filter).then(function(slametrics) {
      return slametrics;
    }).catch(function(err) {
      console.log(err);
    });
};


//Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data
  Slametrics.remoteMethod('getLatestSlaMetrics',{
      description: "Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data", 
      accepts : {arg:'month',type:'Boolean'},
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
            //  { 'date': { between: [date,nextDate] }},
              { 'date': { lt: nextDate }},

           ]},
     //  include: ['slas'],
       order: 'date DESC',
       limit: limit
     };

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

};
