const secrets = require('./function-utils').getSecrets();
const RingAPI = require('doorbot');

module.exports.ring_client = RingAPI({
    email: process.env['ring_email'],
    password: secrets.ring_password,
    retries: 10, //authentication retries, optional, defaults to 0
});

