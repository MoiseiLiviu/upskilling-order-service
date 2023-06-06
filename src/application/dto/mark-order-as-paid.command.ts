export class MarkOrderAsPaidCommand {
  orderId: number;

  constructor(orderId: number) {
    this.orderId = orderId;
  }
}