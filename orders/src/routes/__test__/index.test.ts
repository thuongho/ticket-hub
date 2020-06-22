import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches orders for a particular user', async () => {
  const buildTicket = async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'Surfs Up',
      price: 15
    });
    await ticket.save();
    return ticket;
  };

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only get the orders for User #2
  const [orderOneRes, orderTwoRes] = response.body;

  expect(response.body.length).toEqual(2);
  expect(orderOneRes?.id).toEqual(orderOne.id);
  expect(orderTwoRes?.id).toEqual(orderTwo.id);
  expect(orderOneRes?.ticket.id).toEqual(orderOne.ticket.id);
  expect(orderTwoRes?.ticket.id).toEqual(orderTwo.ticket.id);
});
