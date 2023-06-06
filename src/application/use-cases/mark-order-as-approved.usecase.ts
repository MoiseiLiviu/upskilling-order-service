import { MarkOrderAsApprovedCommand } from '../dto/mark-order-as-approved.command';
import { OrderRepository } from '../../domain/repository/order.repository';
import { OrderStatus } from '../../domain/models/order-status';
import {
  LoggerPort,
  OrderApprovedEvent,
  OutboxStatus,
  SagaStatus,
} from '@nest-upskilling/common';
import { MarkOrderAsApprovedPort } from '../ports/input/mark-order-as-approved.port';
import { OutboxRepository } from '../../domain/repository/outbox.repository';
import { Outbox } from '../../domain/models/outbox';

export class MarkOrderAsApprovedUseCase implements MarkOrderAsApprovedPort {
  constructor(
    private readonly loggerPort: LoggerPort,
    private readonly orderRepository: OrderRepository,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async execute(command: MarkOrderAsApprovedCommand): Promise<void> {
    this.loggerPort.log(
      'MarkOrderAsApprovedUseCase',
      `Processing command: ${JSON.stringify(command)}`,
    );

    await this.orderRepository.transaction(async () => {
      const order = await this.orderRepository.getById(command.orderId);
      order.status = OrderStatus.APPROVED;

      await this.orderRepository.update(order);

      const orderApprovedEvent = new OrderApprovedEvent(
        command.sagaId,
        order.id,
        order.userId,
        order.subtotal,
        command.items
      );
      await this.outboxRepository.save(
        new Outbox(
          null,
          OutboxStatus.STARTED,
          SagaStatus.PROCESSING,
          JSON.stringify(orderApprovedEvent),
          'order.approved',
          command.sagaId,
        ),
      );
    });
  }
}
