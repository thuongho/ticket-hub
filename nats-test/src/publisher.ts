import nats from 'node-nats-streaming';

// clears the logs of loading up the server
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '12324',
    title: 'Rocking Live',
    price: 20
  });

  stan.publish('ticket:created', data, () => {
    console.log('Published ticket event.');
  });
});
