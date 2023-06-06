import { Order } from '../models/order.model';

export interface OrderRepository {
  save(order: Order): Promise<Order>;

  getById(orderId: number): Promise<Order>;

  update(order: Order): Promise<void>;

  transaction<R>(callback: () => Promise<R>): Promise<R>;
}
