const utils = require('../function-utils');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var ringData = req.body[0];
    ringData['id'] = utils.generateUUID();

    context.ringDocument = JSON.stringify(ringData);

    context.res = {
        status: 202
    };
    context.done();
};