import { AbstractEntity } from '@nest-upskilling/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatus } from '../../../domain/models/order-status';

@Entity('order')
export class OrderEntity extends AbstractEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'payment_id' })
  paymentId: number;

  @Column({ enum: OrderStatus, type: 'enum' })
  status: OrderStatus;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @Column()
  subtotal: number;

  constructor(
    userId: number,
    paymentId: number,
    items: OrderItemEntity[],
    status: OrderStatus,
    subtotal: number,
  ) {
    super();
    this.userId = userId;
    this.paymentId = paymentId;
    this.items = items;
    this.status = status;
    this.subtotal = subtotal;
  }
}
