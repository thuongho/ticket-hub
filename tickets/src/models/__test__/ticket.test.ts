import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'Man on the run',
    price: 20,
    userId: '1232'
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 30 });
  secondInstance!.set({ price: 45 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error
  // expect(async () => {
  //   await secondInstance!.save();
  // }).toThrow();
  try {
    await secondInstance!.save();
  } catch (e) {
    // jest cannot tell when the test is done
    // use the done callback to tell jest we are done with the test
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number of multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Cats Cats Cats',
    price: 120,
    userId: 'ag123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
