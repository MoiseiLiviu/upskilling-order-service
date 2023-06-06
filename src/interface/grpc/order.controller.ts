import { Controller, Inject } from '@nestjs/common';
import { LoggerAdapterToken, LoggerPort } from '@nest-upskilling/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetOrderStatusRequest,
  GetOrderStatusResponse,
  InitOrderRequest,
  InitOrderResponse,
} from '../../proto/order.pb';
import {
  INIT_ORDER_USE_CASE,
  OrderRepositoryToken,
} from '../../tokens/order-tokens';
import { InitOrderPort } from '../../application/ports/input/init-order.port';
import { OrderRepository } from '../../domain/repository/order.repository';

@Controller()
export class OrderController {
  constructor(
    @Inject(INIT_ORDER_USE_CASE)
    private readonly initOrderPort: InitOrderPort,
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  @GrpcMethod('OrderService', 'InitOrder')
  async initOrder(payload: InitOrderRequest): Promise<InitOrderResponse> {
    this.loggerPort.log(
      'OrderController',
      `Received a initOrderRequest: ${JSON.stringify(payload)}`,
    );
    return { orderId: await this.initOrderPort.execute(payload) };
  }

  @GrpcMethod('OrderService', 'GetOrderStatus')
  async getOrderStatus(
    payload: GetOrderStatusRequest,
  ): Promise<GetOrderStatusResponse> {
    this.loggerPort.log(
      'OrderController',
      `Received a initOrderRequest: ${JSON.stringify(payload)}`,
    );

    const order = await this.orderRepository.getById(payload.orderId);
    return { status: order.status };
  }
}
