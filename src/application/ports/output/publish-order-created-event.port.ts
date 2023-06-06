import { OrderCreatedEvent } from '@nest-upskilling/common';

export interface PublishOrderCreatedEventPort {
  execute(orderCreatedEvent: OrderCreatedEvent): Promise<void>;
}
