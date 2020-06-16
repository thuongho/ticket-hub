import { Publisher, Subjects, TicketCreatedEvent } from '@thtickets/common';

/**
 * Use this TicketCreatedPusher to emit a message on ticket creation
 * usage: new TicketCreatedPublisher(nats).publish(ticket)
 */

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
