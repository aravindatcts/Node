'use strict';

module.exports = function(Slametrics) {


 Slametrics.getLatestSlaMetrics = (month,cb) => {
   var filter =   { 
       where : {month_ind : month},
       order: 'date DESC' };

  console.log(month);

  return Slametrics.findOne(filter).then(function(slametrics) {
      return slametrics;
    }).catch(function(err) {
      console.log(err);
    });
};

  Slametrics.remoteMethod('getLatestSlaMetrics',{
      description: "Get the latest SLA Metrics available, Pass Month=False for daily and Month = True for Monthly data", 
      accepts : {arg:'month',type:'Boolean'},
      http: { 
          path : '/getLatestSlaMetrics',
          verb : 'get'
      },
      returns: {arg: 'slametrics', type:'object'}
  });


};
