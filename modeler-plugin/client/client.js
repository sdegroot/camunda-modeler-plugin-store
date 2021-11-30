var ws = null;
var wsPromise = null;

// TODO: set interval to clean awaits 
let awaitResponses = [];

export async function start(options) {
    if (ws) {
        return Promise.resolve(); // do not start another client
    }

    options.port = options.port || 1337;

    return wsPromise = new Promise((resolve, reject) => {
        ws = new WebSocket('ws://localhost:' + options.port);

        ws.onopen = function open() {
            resolve();
        };

        ws.onmessage = function message({ data }) {
            console.log('received: %s', data);
            data = JSON.parse(data);

            awaitResponses.filter(expectedResponse => expectedResponse.ref == data.ref).forEach(expectedResponse => {
                const index = awaitResponses.indexOf(expectedResponse);
                awaitResponses.splice(index, 1);

                if (data.type == 'error') {
                    expectedResponse.reject(data.data);
                } else {
                    expectedResponse.resolve(data.data);
                }
            });
        };
    });
}

export async function listPlugins() {
    await wsPromise;
    const opId = 'op1';

    var promise = new Promise((resolve, reject) => {
        awaitResponses.push({
            ref: opId,
            time: Date.now(),
            resolve,
            reject
        })
    });

    ws.send(JSON.stringify({ type: 'request', operation: 'listPlugins', ref: opId }))

    return promise;
}

export async function removePlugin(pluginName) {
    await wsPromise;
    const opId = 'op1';

    var promise = new Promise((resolve, reject) => {
        awaitResponses.push({
            ref: opId,
            time: Date.now(),
            resolve,
            reject
        })
    });

    ws.send(JSON.stringify({ type: 'request', operation: 'removePlugin', ref: opId, name: pluginName }))

    return promise;
}