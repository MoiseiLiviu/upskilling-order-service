export class OrderItem {
  id: number;
  quantity: number;
  subtotal: number;
  productId: number;
  userId: number;
  price: number;

  constructor(
    quantity: number,
    productId: number,
    userId: number,
    price: number,
    id?: number
  ) {
    this.id = id;
    this.quantity = quantity;
    this.productId = productId;
    this.userId = userId;
    this.price = price;
    this.subtotal = quantity * price;
  }
}
