import { AbstractEntity } from '@nest-upskilling/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_item')
export class OrderItemEntity extends AbstractEntity {
  @Column()
  quantity: number;

  @Column()
  subtotal: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  price: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  constructor(
    id: number,
    quantity: number,
    subtotal: number,
    productId: number,
    userId: number,
    price: number,
  ) {
    super();
    this.id = id;
    this.quantity = quantity;
    this.subtotal = subtotal;
    this.productId = productId;
    this.userId = userId;
    this.price = price;
  }
}
