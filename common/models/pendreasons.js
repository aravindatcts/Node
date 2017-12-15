'use strict';
var moment = require('moment');


module.exports = function(Pendreasons) {
  Pendreasons.getPendReasonForDateRange = (startDate, endDate, monthInd, pendReason, cb) => {
    var nextDate;
    if (monthInd) {
      nextDate = moment(endDate).add(1, 'M').toDate();
      console.log(nextDate);
    } else {
      nextDate = moment(endDate).add(1, 'd').toDate();
    }
    var filter =   {
      where:
      {'and':
      [
        {'pendDate': {between: [startDate, nextDate]}},
        {'_pendreasons.reason': pendReason},
      ]},
      order: 'date DESC',
    };
//
    console.log(startDate);
    console.log(endDate);

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
