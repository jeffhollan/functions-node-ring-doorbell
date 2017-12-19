const RingAPI = require('doorbot');
const https = require('https');
const url = require('url');
const eventGridUrl = url.parse(process.env['eventgrid_endpoint']);

const ring = RingAPI({
    email: process.env['ring_email'],
    password: GetSecrets().ring_password,
    retries: 10, //authentication retries, optional, defaults to 0
});

const options = {
    protocol: 'https:',    
    hostname: eventGridUrl.hostname,
    path: eventGridUrl.path,
    headers: {
        'content-type': 'application/json',
        'aeg-sas-key': GetSecrets().eventgrid_key,
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
        id: generateUUID(),
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

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

// TODO: Change to call keyvault to grab secrets
function GetSecrets() {
    return {
        eventgrid_key: process.env['eventgrid_key'],
        ring_password: process.env['ring_password']
    }
}