import { Outbox } from '../../../domain/models/outbox';
import { OutboxEntity } from '../entities/outbox.entity';

export class OutboxEntityMapper {
  static toEntity(outboxModel: Outbox): OutboxEntity {
    return new OutboxEntity(
      outboxModel.status,
      outboxModel.sagaId,
      outboxModel.sagaStatus,
      outboxModel.payload,
      outboxModel.eventType,
    );
  }

  static toModel(outboxEntity: OutboxEntity): Outbox {
    return new Outbox(
      outboxEntity.id,
      outboxEntity.status,
      outboxEntity.sagaStatus,
      outboxEntity.payload,
      outboxEntity.eventType,
      outboxEntity.sagaId,
    );
  }
}
