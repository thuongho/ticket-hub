import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// clears the logs of loading up the server
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish({
    id: '1234',
    title: 'Rolling Waves',
    price: 16
  });
  // const data = JSON.stringify({
  //   id: '12324',
  //   title: 'Rocking Live',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Published ticket event.');
  // });
});
