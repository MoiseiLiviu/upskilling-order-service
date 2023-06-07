import { Module } from '@nestjs/common';
import {
  LoggerAdapterToken,
  LoggerModule,
  LoggerPort,
} from '@nest-upskilling/common';
import {
  INIT_ORDER_USE_CASE,
  MARK_ORDER_AS_APPROVED_USE_CASE,
  MARK_ORDER_AS_FAILED_USE_CASE,
  MARK_ORDER_AS_PAID_USE_CASE,
  OrderRepositoryToken,
  OutboxRepositoryToken,
} from '../tokens/order-tokens';
import { OrderRepository } from '../domain/repository/order.repository';
import { InitOrderUseCase } from './use-cases/init-order.usecase';
import { MarkOrderAsApprovedUseCase } from './use-cases/mark-order-as-approved.usecase';
import { OrderInfrastructureModule } from '../infrastructure/order-infrastructure.module';
import { MarkOrderAsPaidUseCase } from './use-cases/mark-order-as-paid.usecase';
import { MarkOrderAsFailedUseCase } from './use-cases/mark-order-as-failed.usecase';
import { OutboxEventsScheduler } from './outbox/outbox-events.scheduler';
import { OutboxRepository } from '../domain/repository/outbox.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboxCleanerScheduler } from "./outbox/outbox-cleaner.scheduler";

require('dotenv').config();

@Module({
  imports: [
    LoggerModule,
    OrderInfrastructureModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
          },
          consumer: {
            groupId: 'order-service-group',
          },
        },
      },
    ]),
  ],
  providers: [
    {
      inject: [LoggerAdapterToken, OrderRepositoryToken, OutboxRepositoryToken],
      provide: INIT_ORDER_USE_CASE,
      useFactory: (
        loggerPort: LoggerPort,
        orderRepository: OrderRepository,
        outboxRepository: OutboxRepository,
      ) => new InitOrderUseCase(loggerPort, orderRepository, outboxRepository),
    },
    OutboxEventsScheduler,
    OutboxCleanerScheduler,
    {
      inject: [LoggerAdapterToken, OrderRepositoryToken, OutboxRepositoryToken],
      provide: MARK_ORDER_AS_APPROVED_USE_CASE,
      useFactory: (
        loggerPort: LoggerPort,
        orderRepository: OrderRepository,
        outboxRepository: OutboxRepository,
      ) =>
        new MarkOrderAsApprovedUseCase(
          loggerPort,
          orderRepository,
          outboxRepository,
        ),
    },
    {
      inject: [LoggerAdapterToken, OrderRepositoryToken],
      provide: MARK_ORDER_AS_PAID_USE_CASE,
      useFactory: (loggerPort: LoggerPort, orderRepository: OrderRepository) =>
        new MarkOrderAsPaidUseCase(loggerPort, orderRepository),
    },
    {
      inject: [LoggerAdapterToken, OrderRepositoryToken],
      provide: MARK_ORDER_AS_FAILED_USE_CASE,
      useFactory: (loggerPort: LoggerPort, orderRepository: OrderRepository) =>
        new MarkOrderAsFailedUseCase(loggerPort, orderRepository),
    },
  ],
  exports: [
    INIT_ORDER_USE_CASE,
    MARK_ORDER_AS_APPROVED_USE_CASE,
    MARK_ORDER_AS_PAID_USE_CASE,
    MARK_ORDER_AS_FAILED_USE_CASE,
  ],
})
export class OrderApplicationModule {}
