import { Module } from '@nestjs/common';
import { OrderApplicationModule } from './application/order-application.module';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './interface/grpc/order.controller';
import { OrderInfrastructureModule } from './infrastructure/order-infrastructure.module';
import { LoggerModule } from '@nest-upskilling/common';
import { OrderKafkaController } from './interface/messaging/order-kafka-controller';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    LoggerModule,
    ScheduleModule.forRoot(),
    OrderApplicationModule,
    OrderInfrastructureModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [OrderController, OrderKafkaController],
})
export class OrderModule {}
