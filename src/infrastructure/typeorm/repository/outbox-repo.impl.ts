import { OutboxRepository } from '../../../domain/repository/outbox.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OutboxEntity } from '../entities/outbox.entity';
import { Outbox } from '../../../domain/models/outbox';
import { OutboxStatus } from '@nest-upskilling/common';
import { OutboxEntityMapper } from '../mapper/outbox-entity.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OutboxRepoImpl implements OutboxRepository {
  constructor(
    @InjectRepository(OutboxEntity)
    private readonly outboxRepository: Repository<OutboxEntity>,
  ) {}

  async deleteAllCompletedOrFailed(): Promise<void> {
    await this.outboxRepository
      .createQueryBuilder()
      .delete()
      .where('status=1 OR status=2')
      .execute();
  }

  async findAllStarted(): Promise<Outbox[]> {
    const entities = await this.outboxRepository.findBy({
      status: OutboxStatus.STARTED,
    });
    return entities.map((entity) => OutboxEntityMapper.toModel(entity));
  }

  async findBySagaIdAndStatus(sagaId: string, status): Promise<Outbox> {
    const entity = await this.outboxRepository.findOneBy({
      sagaId,
      sagaStatus: status,
    });
    return OutboxEntityMapper.toModel(entity);
  }

  async save(outbox: Outbox): Promise<Outbox> {
    const savedEntity = await this.outboxRepository.save(
      OutboxEntityMapper.toEntity(outbox),
    );
    return OutboxEntityMapper.toModel(savedEntity);
  }

  async update(outbox: Outbox): Promise<void> {
    await this.outboxRepository.update(outbox.id, outbox);
  }
}
