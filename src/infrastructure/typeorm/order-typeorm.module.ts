import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import {
  OrderRepositoryToken,
  OutboxRepositoryToken,
} from '../../tokens/order-tokens';
import { OrderRepoImpl } from './repository/order-repo-impl';
import { ConfigService } from '@nestjs/config';
import { OrderItemEntity } from './entities/order-item.entity';
import { getTypeOrmConfig } from './config/typeorm.config';
import { OutboxEntity } from './entities/outbox.entity';
import { OutboxRepoImpl } from './repository/outbox-repo.impl';
import { LoggerModule } from '@nest-upskilling/common';

@Module({
  providers: [
    {
      provide: OrderRepositoryToken,
      useClass: OrderRepoImpl,
    },
    {
      provide: OutboxRepositoryToken,
      useClass: OutboxRepoImpl,
    },
  ],
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService, [
          OrderEntity,
          OrderItemEntity,
          OutboxEntity,
        ]),
    }),
    TypeOrmModule.forFeature([OutboxEntity, OrderEntity, OrderItemEntity]),
  ],
  exports: [OrderRepositoryToken, OutboxRepositoryToken],
})
export class OrderTypeormModule {}
