const ring = require('../ring-api').ring_client;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    // Not grabbing it from an array as expecting to get event from a Logic App and not
    // directly from Azure Event Grid
    ring.recording(req.body['data']['id_str'], (e, recording) => {
        context.log(`got recording link: ${recording}`);
        if(recording) {
            context.res = {
                status: 200,
                body: recording
            }
        } else {
            context.res = {
                status: 404,
                body: null
            }
        }
        context.done();
    })
    
};