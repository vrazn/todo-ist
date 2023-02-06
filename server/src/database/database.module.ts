import { DynamicModule, Module } from '@nestjs/common';

import {
  createDatabasePoolConnection,
  createDatabaseProviderForFeature,
} from './database.provider';
import { DatabaseFeatureOptions } from './types/database';

@Module({})
export class DatabaseModule {
  static forFeature(options: DatabaseFeatureOptions): DynamicModule {
    const databaseProvider = createDatabaseProviderForFeature(options);

    return {
      module: DatabaseModule,
      providers: [createDatabasePoolConnection(), databaseProvider],
      exports: [databaseProvider],
    };
  }
}
