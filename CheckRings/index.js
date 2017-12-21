const https = require('https');
const parse = require('url').parse;
const eventGridUrl = parse(process.env['eventgrid_endpoint']);

const utils = require('../function-utils');
const ring = require('../ring-api').ring_client;

const options = {
    protocol: 'https:',    
    hostname: eventGridUrl.hostname,
    path: eventGridUrl.path,
    headers: {
        'content-type': 'application/json',
        'aeg-sas-key': utils.getSecrets().eventgrid_key,
        Accept: 'application/json'
    },
    method: 'POST'
}

module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    context.log('JavaScript timer trigger function triggered.', timeStamp);

    // Check rings from ring.com
    ring.dings((e, json) => {
        // If rings are returned
        if (json.length != 0) {
            context.log(`Got a ring of kind ${json[0]['kind']}`);
            // Send an event to EventGrid
            EmitEvent(json[0], context, (res) => {
                context.log(`got response: ${res}`);
                context.done();
            });
        } else {
            context.log('No ring event');
            context.done();
        }
    });
};

function EmitEvent(ringEvent, context, callback) {
    context.log('Sending event to event grid.');
    var eventGridPayload = [{
        id: utils.generateUUID(),
        eventType: ringEvent['kind'],
        subject: 'ring/frontDoor',
        eventTime: new Date().toISOString(),
        data: ringEvent
    }];
    var response = '';
    var req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            response += chunk;
        });
        res.on('end', () => {
            context.log(response);
            callback(response);
        });
    });
    req.write(JSON.stringify(eventGridPayload));
    req.end();
}