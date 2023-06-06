import { CartItemDto } from '@nest-upskilling/common';

export class MarkOrderAsApprovedCommand {
  orderId: number;
  sagaId: string;
  items: CartItemDto[];

  constructor(orderId: number, sagaId: string, items: CartItemDto[]) {
    this.orderId = orderId;
    this.sagaId = sagaId;
    this.items = items;
  }
}
