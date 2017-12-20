const utils = require('../function-utils');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var ringData = req.body[0];
    ringData['id'] = ringData['id'] || utils.generateUUID();
    context.log(ringData);
    context.bindings.ringDocument = JSON.stringify(ringData);

    context.res = {
        status: 202,
        body: null
    };
    context.done();
};