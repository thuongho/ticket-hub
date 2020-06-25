import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@thtickets/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'Dogs Journey',
    price: 15,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const order = Order.build({
    userId: 'afdads',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { data, listener, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
