import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = stan.subscribe('ticket:created');

  // event is referred to as 'message' in the world of NATS
  subscription.on('message', (msg) => {
    console.log('Message received');
  });
});
