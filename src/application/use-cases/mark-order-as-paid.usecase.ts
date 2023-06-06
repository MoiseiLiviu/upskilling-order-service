import { MarkOrderAsPaidPort } from '../ports/input/mark-order-as-paid.port';
import { MarkOrderAsPaidCommand } from '../dto/mark-order-as-paid.command';
import { LoggerPort } from '@nest-upskilling/common';
import { OrderRepository } from '../../domain/repository/order.repository';
import { OrderStatus } from '../../domain/models/order-status';

export class MarkOrderAsPaidUseCase implements MarkOrderAsPaidPort {
  constructor(
    private readonly loggerPort: LoggerPort,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(markOrderAsPaidCommand: MarkOrderAsPaidCommand): Promise<void> {
    this.loggerPort.log(
      'MarkOrderAsPaidUseCase',
      `Received command: ${JSON.stringify(markOrderAsPaidCommand)}`,
    );
    const order = await this.orderRepository.getById(
      markOrderAsPaidCommand.orderId,
    );
    order.status = OrderStatus.PAID;
    await this.orderRepository.update(order);
  }
}
