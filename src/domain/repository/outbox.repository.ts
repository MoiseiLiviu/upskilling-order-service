import { Outbox } from '../models/outbox';
import { SagaStatus } from '@nest-upskilling/common';

export interface OutboxRepository {
  save(outbox: Outbox): Promise<Outbox>;

  update(outbox: Outbox): Promise<void>;

  findBySagaIdAndStatus(
    sagaId: string,
    status: SagaStatus,
  ): Promise<Outbox>;

  findAllStarted(): Promise<Outbox[]>;

  deleteAllCompletedOrFailed(): Promise<void>;
}
