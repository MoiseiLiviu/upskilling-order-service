export interface PublishOrderApprovedEventPort {
  execute(orderId: number, userId: number, price: number);
}