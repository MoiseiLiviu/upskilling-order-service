import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { MarkOrderAsApprovedCommand } from '../../application/dto/mark-order-as-approved.command';
import {
  LoggerAdapterToken,
  LoggerPort,
  OrderApprovedEvent,
  OrderItemsApprovedEvent,
  OrderItemsRejectedEvent,
  PaymentProcessingFailedEvent,
} from '@nest-upskilling/common';
import {
  MARK_ORDER_AS_APPROVED_USE_CASE,
  MARK_ORDER_AS_FAILED_USE_CASE,
  MARK_ORDER_AS_PAID_USE_CASE,
} from '../../tokens/order-tokens';
import { MarkOrderAsPaidCommand } from '../../application/dto/mark-order-as-paid.command';
import { MarkOrderAsApprovedPort } from '../../application/ports/input/mark-order-as-approved.port';
import { MarkOrderAsFailedPort } from '../../application/ports/input/mark-order-as-failed.port';
import { MarkOrderAsPaidPort } from '../../application/ports/input/mark-order-as-paid.port';
import { OrderStatus } from '../../domain/models/order-status';

@Controller()
export class OrderKafkaController {
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @Inject(MARK_ORDER_AS_APPROVED_USE_CASE)
    private readonly markOrderAsApprovedUseCase: MarkOrderAsApprovedPort,
    @Inject(MARK_ORDER_AS_FAILED_USE_CASE)
    private readonly markOrderAsFailedPort: MarkOrderAsFailedPort,
    @Inject(MARK_ORDER_AS_PAID_USE_CASE)
    private readonly markOrderAsPaid: MarkOrderAsPaidPort,
  ) {}

  @MessagePattern('catalog.order.items.approved', Transport.KAFKA)
  async handleOrderApproved(
    @Payload() orderItemsApprovedEvent: OrderItemsApprovedEvent,
    @Ctx() context: KafkaContext,
  ) {
    this.loggerPort.log(
      'OrderKafkaController',
      `Received event on topic ${context.getTopic()} with message ${JSON.stringify(
        orderItemsApprovedEvent,
      )}`,
    );

    await this.markOrderAsApprovedUseCase.execute(
      new MarkOrderAsApprovedCommand(
        orderItemsApprovedEvent.orderId,
        orderItemsApprovedEvent.sagaId,
        orderItemsApprovedEvent.items,
      ),
    );
  }

  @MessagePattern('order.paid.successfully', Transport.KAFKA)
  async handleOrderPaid(
    @Payload() orderApprovedEvent: OrderApprovedEvent,
    @Ctx() context: KafkaContext,
  ) {
    this.loggerPort.log(
      'OrderKafkaController',
      `Received event on topic ${context.getTopic()} with message ${JSON.stringify(
        orderApprovedEvent,
      )}`,
    );

    await this.markOrderAsPaid.execute(
      new MarkOrderAsPaidCommand(orderApprovedEvent.orderId),
    );
  }

  @MessagePattern('catalog.order.items.rejected', Transport.KAFKA)
  async handleOrderItemsApprovalRejected(
    @Payload() orderItemsRejectedEvent: OrderItemsRejectedEvent,
    @Ctx() context: KafkaContext,
  ) {
    this.loggerPort.log(
      'OrderKafkaController',
      `Received event on topic ${context.getTopic()} with message ${JSON.stringify(
        orderItemsRejectedEvent,
      )}`,
    );

    await this.markOrderAsFailedPort.execute(
      orderItemsRejectedEvent.orderId,
      OrderStatus.ITEMS_REJECTED,
    );
  }

  @MessagePattern('order.payment.failed', Transport.KAFKA)
  async handlePaymentFailed(
    @Payload() paymentProcessingFailedEvent: PaymentProcessingFailedEvent,
    @Ctx() context: KafkaContext,
  ) {
    this.loggerPort.log(
      'OrderKafkaController',
      `Received event on topic ${context.getTopic()} with message ${JSON.stringify(
        paymentProcessingFailedEvent,
      )}`,
    );

    await this.markOrderAsFailedPort.execute(
      paymentProcessingFailedEvent.orderId,
      OrderStatus.PAYMENT_FAILED,
    );
  }
}
