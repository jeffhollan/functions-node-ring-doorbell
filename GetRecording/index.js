const ring = require('../ring-api').ring_client;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    ring.recording(req.body[0]['data']['id_str'], (e, recording) => {
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