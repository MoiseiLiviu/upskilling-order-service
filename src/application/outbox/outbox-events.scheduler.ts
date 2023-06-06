import { OutboxRepository } from '../../domain/repository/outbox.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import {
  LoggerAdapterToken,
  LoggerPort,
  OutboxStatus,
} from '@nest-upskilling/common';
import { ClientKafka } from '@nestjs/microservices';
import { OutboxRepositoryToken } from '../../tokens/order-tokens';

@Injectable()
export class OutboxEventsScheduler {
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @Inject(OutboxRepositoryToken)
    private readonly outboxRepository: OutboxRepository,
    @Inject('KAFKA_SERVICE')
    private readonly clientKafka: ClientKafka,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    const job = new CronJob(
      CronExpression.EVERY_5_SECONDS,
      ()=>this.dispatchEvents(),
    );
    this.schedulerRegistry.addCronJob('outbox', job);
    job.start();
  }

  async dispatchEvents() {
    this.loggerPort.log('OutboxEventsScheduler', 'Dispatching events...');
    const outboxEvents = await this.outboxRepository.findAllStarted();
    for (const event of outboxEvents) {
      try {
        await this.clientKafka.emit(event.eventType, event.payload);
        this.loggerPort.log(
          'OutboxEventsScheduler',
          `Sending event: ${event.payload}, on topic ${event.eventType}`,
        );
        event.status = OutboxStatus.COMPLETED;
      } catch (err) {
        this.loggerPort.error('OutboxEventsScheduler', err);
        event.status = OutboxStatus.FAILED;
      }

      await this.outboxRepository.update(event);
    }
  }
}
