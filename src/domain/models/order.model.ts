import { OrderItem } from './order-item.model';
import { OrderStatus } from './order-status';

export class Order {
  id: number;
  userId: number;
  status: OrderStatus = OrderStatus.CREATED;
  paymentId: number;
  items: OrderItem[];
  subtotal: number;

  constructor(userId: number, id?: number) {
    this.id = id;
    this.userId = userId;
  }
}
