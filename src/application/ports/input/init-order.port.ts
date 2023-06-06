import { InitOrderRequest } from '../../../proto/order.pb';

export interface InitOrderPort {
  execute(initOrderRequest: InitOrderRequest): Promise<number>;
}
