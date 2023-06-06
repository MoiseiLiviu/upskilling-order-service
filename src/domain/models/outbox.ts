import { OutboxStatus, SagaStatus } from '@nest-upskilling/common';

export class Outbox {
  id: number;
  status: OutboxStatus;
  sagaStatus: SagaStatus;
  payload: string;
  eventType: string;
  sagaId: string;

  static startNewSaga(payload: string, eventType: string, sagaId: string) {
    return new Outbox(
      null,
      OutboxStatus.STARTED,
      SagaStatus.STARTED,
      payload,
      eventType,
      sagaId,
    );
  }

  constructor(
    id: number,
    status: OutboxStatus,
    sagaStatus: SagaStatus,
    payload: string,
    eventType: string,
    sagaId: string,
  ) {
    this.id = id;
    this.status = status;
    this.sagaStatus = sagaStatus;
    this.payload = payload;
    this.eventType = eventType;
    this.sagaId = sagaId;
  }
}
