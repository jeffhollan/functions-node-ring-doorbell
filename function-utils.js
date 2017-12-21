module.exports.generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

// TODO: Change to call keyvault to grab secrets
module.exports.getSecrets = function () {
    return {
        eventgrid_key: process.env['eventgrid_key'],
        ring_password: process.env['ring_password']
    }
}