import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '../../domain/repository/order.repository';
import { OutboxRepository } from '../../domain/repository/outbox.repository';
import { InitOrderRequest } from '../../proto/order.pb';
import { InitOrderUseCase } from './init-order.usecase';
import { OrderEntity } from '../../infrastructure/typeorm/entities/order.entity';
import { OutboxEntity } from '../../infrastructure/typeorm/entities/outbox.entity';
import { OrderRepoImpl } from '../../infrastructure/typeorm/repository/order-repo-impl';
import { OutboxRepoImpl } from '../../infrastructure/typeorm/repository/outbox-repo.impl';
import { LoggerAdapterToken, LoggerPort } from '@nest-upskilling/common';
import {
  OrderRepositoryToken,
  OutboxRepositoryToken,
} from '../../tokens/order-tokens';

describe('InitOrderUseCase', () => {
  let useCase: InitOrderUseCase;
  let orderRepository: OrderRepository;
  let outboxRepository: OutboxRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [OrderEntity, OutboxEntity],
          migrations: ['dist/migrations/*{.ts,.js}'],
          migrationsRun: true,
          synchronize: false,
        }),
        TypeOrmModule.forFeature([OrderEntity, OutboxEntity]),
      ],
      providers: [
        {
          provide: OrderRepositoryToken,
          useClass: OrderRepoImpl,
        },
        {
          provide: OutboxRepositoryToken,
          useClass: OutboxRepoImpl,
        },
        {
          provide: InitOrderUseCase,
          inject: [
            LoggerAdapterToken,
            OrderRepositoryToken,
            OutboxRepositoryToken,
          ],
          useFactory: (
            loggerPort: LoggerPort,
            orderRepository: OrderRepository,
            outboxRepository: OutboxRepository,
          ) =>
            new InitOrderUseCase(loggerPort, orderRepository, outboxRepository),
        },
        {
          provide: LoggerAdapterToken,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    useCase = moduleRef.get<InitOrderUseCase>(InitOrderUseCase);
    orderRepository = moduleRef.get<OrderRepository>(OrderRepoImpl);
    outboxRepository = moduleRef.get<OutboxRepository>(OutboxRepoImpl);
  });

  it('should create order and outbox successfully', async () => {
    const initOrderRequest: InitOrderRequest = {
      userId: 1,
      items: [{ productId: 1, quantity: 1, price: 100 }],
    };

    const orderId = await useCase.execute(initOrderRequest);

    const order = await orderRepository.getById(orderId);
    const outboxItems = await outboxRepository.findAllStarted();

    expect(order).toBeDefined();
    expect(order.id).toEqual(orderId);
    expect(order.subtotal).toEqual(100);
    expect(order.items.length).toEqual(1);
    expect(outboxItems).toBeDefined();
    expect(outboxItems).toHaveLength(1);
  });
});
