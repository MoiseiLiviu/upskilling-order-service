import { MarkOrderAsFailedPort } from '../ports/input/mark-order-as-failed.port';
import { OrderRepository } from '../../domain/repository/order.repository';
import { OrderStatus } from '../../domain/models/order-status';
import { LoggerPort } from '@nest-upskilling/common';

export class MarkOrderAsFailedUseCase implements MarkOrderAsFailedPort {
  constructor(
    private readonly loggerPort: LoggerPort,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: number, orderStatus: OrderStatus) {
    const order = await this.orderRepository.getById(orderId);
    order.status = orderStatus;

    this.loggerPort.log(
      'MarkOrderAsFailedUseCase',
      `Marking order with id: ${orderId} as failed with status: ${JSON.stringify(orderStatus)}`,
    );

    await this.orderRepository.update(order);
  }
}
