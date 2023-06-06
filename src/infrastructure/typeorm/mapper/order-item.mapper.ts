import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderItem } from '../../../domain/models/order-item.model';

export class OrderItemMapper {
  static toModel(entity: OrderItemEntity): OrderItem {
    return new OrderItem(
      entity.quantity,
      entity.productId,
      entity.userId,
      entity.price,
      entity.id,
    );
  }

  static toEntity(model: OrderItem): OrderItemEntity {
    return new OrderItemEntity(
      model.id,
      model.quantity,
      model.subtotal,
      model.productId,
      model.userId,
      model.price,
    );
  }
}
