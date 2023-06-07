import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from './proto/order.pb';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: 'node_modules/upskilling-protos/proto/order.proto',
        url: '0.0.0.0:5003',
      },
    },
    { inheritAppConfig: true },
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
      },
      consumer: {
        groupId: 'order-service-group',
      },
    },
  });
  await app.startAllMicroservices();
}

bootstrap();
