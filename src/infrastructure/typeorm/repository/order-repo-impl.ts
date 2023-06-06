import { OrderRepository } from '../../../domain/repository/order.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../../domain/models/order.model';
import { OrderMapper } from '../mapper/order.mapper';
import { LoggerAdapterToken, LoggerPort } from '@nest-upskilling/common';
import { OutboxRepositoryToken } from '../../../tokens/order-tokens';
import { OutboxRepository } from '../../../domain/repository/outbox.repository';
@Injectable()
export class OrderRepoImpl implements OrderRepository {
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(OutboxRepositoryToken)
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async save(order: Order): Promise<Order> {
    const savedEntity = await this.orderRepository.save(
      OrderMapper.toEntity(order),
    );

    return OrderMapper.toModel(savedEntity);
  }

  async getById(orderId: number): Promise<Order> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    return OrderMapper.toModel(orderEntity);
  }

  async update(order: Order): Promise<void> {
    await this.orderRepository.update(
      { id: order.id },
      OrderMapper.toEntity(order),
    );
  }

  async transaction<R>(callback: () => Promise<R>): Promise<R> {
    return await this.orderRepository.manager.transaction(
      async () => await callback(),
    );
  }
}
