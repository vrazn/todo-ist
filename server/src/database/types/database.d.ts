import { Type } from '@nestjs/common';

export interface DatabaseFeatureOptions {
  tableName: string;
}

export interface SelectParams {
  /**
   * The query string using `?` or `$1` to mark parameters for a parameterized query
   */
  query: string;
  /**
   * Filtering condition on what to query for
   */
  where?: string;
  /**
   * The values to inject into the query at runtime. Helps to protect from an SQL injection
   */
  variables: any[];
}

export interface InsertParams {
  /**
   * The query string using `?` or `$1` to mark parameters for a parameterized query
   */
  query: string;
  /**
   * Filtering condition
   */
  where: string;
  /**
   * The values to inject into the query at runtime. Helps to protect from an SQL injection
   */
  variables: any[];
}

export interface UpdateParams {
  /**
   * The query string using `?` or `$1` to mark parameters for a parameterized query
   */
  query: string;
  /**
   * Filtering condition
   */
  where: string;
  /**
   * The values to inject into the query at runtime. Helps to protect from an SQL injection
   */
  variables: any[];
}

export interface DeleteParams {
  /**
   * Filtering condition
   */
  where: string;
  /**
   * The values to inject into the query at runtime. Helps to protect from an SQL injection
   */
  variables: any[];
}

export interface DatabaseInterface<T> {
  tableName: string;

  /**
   * Method specifically for running `SELECT` queries
   */
  select(params: SelectParams, type: Type<T>): Promise<T[]>;

  /**
   * Method specifically for running `INSERT` queries
   */
  insert(params: InsertParams, type: Type<T>): Promise<T[]>;

  /**
   * Method specifically for running `UPDATE` queries
   */
  update(params: UpdateParams, type: Type<T>): Promise<T[]>;

  /**
   * Method specifically for running `DELETE` queries
   */
  delete(params: DeleteParams, type: Type<T>): Promise<T[]>;
}
