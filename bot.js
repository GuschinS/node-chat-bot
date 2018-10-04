const APIAI_TOKEN = '55f4342cdae642e0866ba1c8c1ad7664';
const APIAI_SESSION_ID = '058ce983cf4a44a0adabeb3fa89fe7ff';

const io = require('socket.io');
const apiai = require('apiai')(APIAI_TOKEN);

module.exports = function(server) {
    io(server).on('connection', function(socket) {
        socket.on('chat message', (text) => {
            let apiaiReq = apiai.textRequest(text, {
                sessionId: APIAI_SESSION_ID
            });

            apiaiReq.on('response', (response) => {
                let aiText = response.result.fulfillment.speech;
                socket.emit('bot reply', aiText);
            });

            apiaiReq.on('error', (error) => {
                console.log(error);
            });

            apiaiReq.end();

        });
    });
}
