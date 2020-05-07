const Nes = require('@hapi/nes');

const client = new Nes.Client('ws://localhost:8915');

const start = async () => {
    await client.connect();
    await client.subscribe('/xyzzy', (update) => {
        console.log('Message received!', update);
    });
};

start();
