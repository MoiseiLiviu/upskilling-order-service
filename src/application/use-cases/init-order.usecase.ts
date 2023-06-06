import { InitOrderPort } from '../ports/input/init-order.port';
import { OrderRepository } from '../../domain/repository/order.repository';
import { Order } from '../../domain/models/order.model';
import { LoggerPort, OrderCreatedEvent } from '@nest-upskilling/common';
import { OrderItem } from '../../domain/models/order-item.model';
import { InitOrderRequest } from '../../proto/order.pb';
import { Outbox } from '../../domain/models/outbox';
import { OutboxRepository } from '../../domain/repository/outbox.repository';

const { v4: uuidv4 } = require('uuid');

export class InitOrderUseCase implements InitOrderPort {
  constructor(
    private readonly loggerPort: LoggerPort,
    private readonly orderRepository: OrderRepository,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async execute(initOrderRequest: InitOrderRequest): Promise<number> {
    this.loggerPort.log(
      'InitOrderUseCase',
      `Initiating order: ${JSON.stringify(initOrderRequest)}`,
    );
    const order = new Order(initOrderRequest.userId);
    order.items = initOrderRequest.items.map(
      (item) =>
        new OrderItem(
          item.quantity,
          item.productId,
          initOrderRequest.userId,
          item.price,
        ),
    );
    order.subtotal = order.items
      .map((i) => i.subtotal)
      .reduce((acc, currentValue) => acc + currentValue, 0);
    const savedOrder = await this.orderRepository.transaction<Order>(
      async () => {
        const newOrder = await this.orderRepository.save(order);

        const sagaId = uuidv4();

        const event = new OrderCreatedEvent(
          newOrder.id,
          order.items,
          newOrder.subtotal,
          sagaId,
        );
        this.loggerPort.log(
          'OrderRepoImpl',
          `Created order with id: ${newOrder.id}`,
        );

        await this.outboxRepository.save(
          Outbox.startNewSaga(JSON.stringify(event), 'order.created', sagaId),
        );
        return newOrder;
      },
    );
    return savedOrder.id;
  }
}
