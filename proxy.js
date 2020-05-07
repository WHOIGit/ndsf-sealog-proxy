const Hapi = require('@hapi/hapi');
const Nes = require('@hapi/nes');

const server = new Hapi.Server({ address: 'localhost', port: 8915 });
const upstream = new Nes.Client('ws://localhost:8914');

const subscriptions = {};

const start = async () => {
    await upstream.connect();

    await server.register(Nes);
    server.subscription('/{anything*}', {
        onSubscribe: async (socket, path) => {
            console.info('Client', socket.id, 'subscribed to', path);
            subscriptions[path] = (subscriptions[path] || 0) + 1;
            if (subscriptions[path] === 1) {
                console.info('Creating upstream subscription to', path);
                upstream.subscribe(path, (update) => {
                    server.publish(path, update);
                });
            }
        },

        onUnsubscribe: async (socket, path) => {
            console.info('Client', socket.id, 'unsubscribed from', path);
            subscriptions[path] = (subscriptions[path] || 1) - 1;
            if (subscriptions[path] === 0) {
                console.info('Removing upstream subscription to', path);
                upstream.unsubscribe(path);
            }
        }
    });
    await server.start();
};

start();
