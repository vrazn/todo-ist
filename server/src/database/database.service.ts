import { Injectable } from '@nestjs/common';
import { camelCase, Options } from 'change-case';
import { Pool } from 'pg';

import type {
  DatabaseFeatureOptions,
  DatabaseInterface,
  SelectParams,
  InsertParams,
  UpdateParams,
  DeleteParams,
} from './types/database';

@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  tableName: string;

  constructor(
    private readonly pool: Pool,
    readonly feature: DatabaseFeatureOptions,
  ) {
    this.tableName = feature.tableName;
  }

  private snakeCaseToCamelCase(
    record: Record<string, unknown>,
  ): Record<string, unknown> {
    const newObj: Record<string, unknown> = {};
    Object.keys(record).forEach((key) => {
      const newKey = camelCase(key);
      newObj[newKey] = record[key];
    });
    return newObj;
  }

  private async runQuery(query: string, params: any[]): Promise<T[]> {
    const start = Date.now();

    try {
      const result = await this.pool.query(query, params);

      console.debug({
        query,
        time: Date.now() - start,
        rows: result.rowCount,
      });

      return result.rows.map(this.snakeCaseToCamelCase) as T[];
    } catch (e) {
      console.debug({
        query,
        time: Date.now() - start,
      });
      console.error(e);
      return [];
    }
  }

  select(params: SelectParams): Promise<T[]> {
    const query = `SELECT ${params.query} FROM ${this.tableName}${
      params.where ? ` WHERE ${params.where};` : ';'
    }`;

    return this.runQuery(query, params.variables);
  }

  insert(params: InsertParams): Promise<T[]> {
    const query = `INSERT INTO ${this.tableName} (${params.query}) VALUES (${params.where}) RETURNING *;`;
    return this.runQuery(query, params.variables);
  }

  update(params: UpdateParams): Promise<T[]> {
    const query = `UPDATE ${this.tableName} SET ${params.query} WHERE ${params.where} RETURNING *;`;
    return this.runQuery(query, params.variables);
  }

  delete(params: DeleteParams): Promise<T[]> {
    const query = `DELETE FROM ${this.tableName} WHERE ${params.where} RETURNING *;`;
    return this.runQuery(query, params.variables);
  }
}
