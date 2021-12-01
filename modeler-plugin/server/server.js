
const WebSocket = require("ws");
const plugins = require('./plugins');

const operations = {
    listPlugins: async (ws, data) => {
        let pluginList = await plugins.listPlugins();
        ws.send(JSON.stringify({
            type: 'response',
            ref: data.ref,
            data: {
                count: pluginList.length,
                plugins: pluginList
            }
        }));
    },

    addPlugin: async (ws, data) => {
        let response = await plugins.addPlugin(data.name);
        ws.send(JSON.stringify({
            type: 'response',
            ref: data.ref,
            data: {
                response: response
            }
        }));
    },

    removePlugin: async (ws, data) => {
        try {
            let response = await plugins.removePlugin(data.name);
            ws.send(JSON.stringify({
                type: 'response',
                ref: data.ref,
                data: {
                    response: response
                }
            }));
        } catch (e) {
            console.log(e);
        }
    },

};


let wss;
let pluginDir;
function initServer(app) {
    if (wss) {
        // already initialized
        return;
    }
    pluginDir = app.getPath('userData') + '/plugins';

    wss = new WebSocket.WebSocketServer({
        port: 1337,
        perMessageDeflate: false
    });


    wss.on('connection', function connection(ws) {
        ws.on('message', function message(dataString) {
            const data = JSON.parse(dataString);
            console.log('received: %s', data);

            if (data.type == 'request' && operations[data.operation]) {
                const operation = operations[data.operation];
                operation(ws, data);
                return;
            }

            ws.send(JSON.stringify({
                type: 'error',
                ref: data.ref,
                message: `Unknown operation '${data.type}:${data.operation}'`
            }));

        });
    });

}


module.exports = {
    initServer
}