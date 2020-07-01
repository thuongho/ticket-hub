import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@thtickets/common';
import { stripe } from '../../stripe';

// jest.mock('../../stripe.ts');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'adada', orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 15
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'sagasd', orderId: order.id })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: userId,
    price: 15
  });
  await order.save();
  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'adada', orderId: order.id })
    .expect(400);
});

// TEST WITH MOCK
// it('returns a 204 with valid inputs', async () => {
//   const userId = mongoose.Types.ObjectId().toHexString();
//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     status: OrderStatus.Created,
//     version: 0,
//     userId,
//     price: 15
//   });
//   await order.save();

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signin(userId))
//     .send({ token: 'tok_visa', orderId: order.id })
//     .expect(201);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual('tok_visa');
//   expect(chargeOptions.amount).toEqual(15 * 100);
//   expect(chargeOptions.currency).toEqual('usd');
// });

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId,
    price
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return (charge.amount = price * 100);
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');
});
