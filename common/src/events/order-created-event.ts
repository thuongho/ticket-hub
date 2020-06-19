import { Subjects } from './types/subjects';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
