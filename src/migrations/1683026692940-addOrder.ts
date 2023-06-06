import { MigrationInterface, QueryRunner } from "typeorm"

export class AddOrder1683026692940 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "order" (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        payment_id BIGINT,
        subtotal NUMERIC,
        status VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await queryRunner.query(`
      CREATE TABLE "order_item" (
        id BIGSERIAL PRIMARY KEY,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC NOT NULL,
        product_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        price NUMERIC NOT NULL,
        order_id BIGINT,
        FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DROP TABLE "order_item";
    `);

        await queryRunner.query(`
      DROP TABLE "order";
    `);
    }
}
