import { OrderEntity } from '../entities/order.entity';
import { Order } from '../../../domain/models/order.model';
import { OrderItemMapper } from './order-item.mapper';

export class OrderMapper {
  static toModel(entity: OrderEntity): Order {
    const order = new Order(entity.userId, entity.id);
    order.paymentId = entity.paymentId;
    order.status = entity.status;
    order.items = entity.items?.map((item) => OrderItemMapper.toModel(item));
    order.subtotal = entity.subtotal;

    return order;
  }

  static toEntity(model: Order) {
    const entity = new OrderEntity(
      model.userId,
      model.paymentId,
      model.items?.map((item) => OrderItemMapper.toEntity(item)),
      model.status,
      model.subtotal,
    );
    entity.items?.map((item) => (item.order = entity));

    return entity;
  }
}
