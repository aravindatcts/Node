'use strict';

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


 //Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data
  Slametrics.remoteMethod('getSLAMetricsForDate',{
      description: "Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data", 
      accepts : {arg:'month',type:'Boolean'},
      http: { 
          path : '/getLatestSlaMetrics',
          verb : 'get'
      },
      returns: {arg: 'slametrics', type:'object'}
  });




};
