import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects
} from '@thtickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
