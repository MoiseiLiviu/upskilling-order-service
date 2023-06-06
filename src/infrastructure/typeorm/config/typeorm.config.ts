import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DB_USERNAME,
  DB_PORT,
  DB_HOST,
  DB_PASSWORD,
  DB_DATABASE,
  DB_LOGGING,
  DB_SSL,
} from '@nest-upskilling/common';

export const getTypeOrmConfig = (
  configService: ConfigService,
  entities: any[],
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get(DB_HOST),
  port: configService.get<number>(DB_PORT),
  username: configService.get(DB_USERNAME),
  password: configService.get(DB_PASSWORD),
  database: configService.get(DB_DATABASE),
  entities,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
  logging: configService.get<boolean>(DB_LOGGING, false),
  ssl: configService.get<boolean>(DB_SSL, false),
});
