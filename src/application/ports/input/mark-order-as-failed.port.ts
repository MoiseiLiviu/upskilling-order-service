import { OrderStatus } from "../../../domain/models/order-status";

export interface MarkOrderAsFailedPort {
  execute(orderId: number, orderStatus: OrderStatus);
}