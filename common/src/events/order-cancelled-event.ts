import { Subjects } from './types/subjects';
import { OrderStatus } from './types/order-status';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
    ticket: {
      id: string;
      price: number;
    };
  };
}
