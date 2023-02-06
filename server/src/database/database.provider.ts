import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import { DATABASE_POOL, DATABASE_FEATURE } from './database.constants';
import { DatabaseService } from './database.service';
import type { DatabaseFeatureOptions } from './types/database';

export function createDatabaseProviderToken(tableName: string): string {
  return `${DATABASE_FEATURE}:${tableName}`;
}

export function createDatabasePoolConnection(): Provider {
  return {
    inject: [ConfigService],
    provide: DATABASE_POOL,
    useFactory: (configService: ConfigService) => {
      const pool = new Pool({
        user: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_DATABASE'),
      });

      return pool.connect();
    },
  };
}

export function createDatabaseProviderForFeature(
  feature: DatabaseFeatureOptions,
): Provider {
  const token = createDatabaseProviderToken(feature.tableName);

  return {
    inject: [DATABASE_POOL],
    provide: token,
    useFactory: (pool: Pool) => {
      return new DatabaseService(pool, feature);
    },
  };
}
