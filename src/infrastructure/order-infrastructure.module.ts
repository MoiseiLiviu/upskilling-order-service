import { Module } from '@nestjs/common';
import { OrderTypeormModule } from './typeorm/order-typeorm.module';
import { LoggerModule } from '@nest-upskilling/common';

@Module({
  imports: [LoggerModule, OrderTypeormModule],
  exports: [OrderTypeormModule],
})
export class OrderInfrastructureModule {}
