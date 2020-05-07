const Hapi = require('@hapi/hapi');
const Nes = require('@hapi/nes');

const server = new Hapi.Server({ address: 'localhost', port: 8914 });

const start = async () => {
    await server.register(Nes);
    server.subscription('/xyzzy');
    await server.start();

    setInterval(() => {
        server.publish('/xyzzy', { message: 'hello world' });
    }, 1000);
};

start();
