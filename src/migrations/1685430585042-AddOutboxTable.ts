import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOutboxTable1685430585042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
CREATE TABLE outbox (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    saga_id VARCHAR(255) NOT NULL,
    saga_status VARCHAR(255) NOT NULL,
    payload JSON NOT NULL,
    event_type VARCHAR(255) NOT NULL
);
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE outbox;
        `);
  }
}
