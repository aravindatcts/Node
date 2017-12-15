'use strict';

module.exports = function(Pendreasons) {
  Pendreasons.getPendReasonForDateRange = (startDate, endDate, monthInd, pendReason, cb) => {
    var filter =   {
      where:
      {'and':
      [{'month_ind': monthInd},
              {'date': {between: [startDate, endDate]}},
              {'_pendreasons.reason': pendReason},
      ]},
    };

    return Pendreasons.find(filter).then(function(pendReason) {
      return pendReason;
    }).catch(function(err) {
      console.log(err);
    });
  };

  Pendreasons.remoteMethod('getPendReasonForDateRange', {
    description: 'Get Pend stats for the provided date range and Pend Reasons ',
    accepts: [
          {arg: 'startDate', type: 'Date'},
          {arg: 'endDate', type: 'Date'},
          {arg: 'monthInd', type: 'Boolean'},
          {arg: 'pendReasn', type: 'String'},
    ],
    http: {
      path: '/getPendReasonForDateRange',
      verb: 'get',
    },
    returns: [{arg: 'pendTrend', type: 'Object'}],
  });
};
