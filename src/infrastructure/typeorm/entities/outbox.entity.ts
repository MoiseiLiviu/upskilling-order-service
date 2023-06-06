import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  OutboxStatus,
  SagaStatus,
} from '@nest-upskilling/common';

@Entity('outbox')
export class OutboxEntity extends AbstractEntity {
  @Column({ type: 'enum', enum: OutboxStatus })
  status: OutboxStatus;

  @Column({ name: 'saga_id' })
  sagaId: string;

  @Column({ type: 'enum', enum: SagaStatus, name: 'saga_status' })
  sagaStatus: SagaStatus;

  @Column({ type: 'json' })
  payload: string;

  @Column({ name: 'event_type' })
  eventType: string;

  constructor(
    status: OutboxStatus,
    sagaId: string,
    sagaStatus: SagaStatus,
    payload: string,
    eventType: string,
  ) {
    super();
    this.status = status;
    this.sagaId = sagaId;
    this.sagaStatus = sagaStatus;
    this.payload = payload;
    this.eventType = eventType;
  }
}
