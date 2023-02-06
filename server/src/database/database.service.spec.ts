import { Test } from '@nestjs/testing';
import { Pool } from 'pg';

import { DatabaseService } from './database.service';

interface MockResult {
  id: number;
  field1: string;
  field2: string;
}

const returnResult: MockResult[] = [
  {
    id: 1,
    field1: 'value1',
    field2: 'value2',
  },
  {
    id: 2,
    field1: 'value1',
    field2: 'value2',
  },
];

const tableName = 'test';

describe('DatabaseService', () => {
  let service: DatabaseService<MockResult>;
  let pool: Pool;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: Pool,
          useValue: {
            query: jest.fn().mockImplementation(() => {
              return Promise.resolve({
                command: `SELECT * FROM ${tableName}`,
                rowCount: 0,
                oid: 123456789,
                fields: ['id', 'field1', 'field2'],
                rows: returnResult,
              });
            }),
          },
        },
        {
          provide: Object,
          useValue: { tableName },
        },
      ],
    }).compile();

    service = await module.resolve(DatabaseService);
    pool = module.get(Pool);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('select', () => {
    it('should run a select query successfully', async () => {
      expect(await service.select({ query: '*', variables: [] })).toEqual(
        returnResult,
      );
    });

    it('should return an empty array if encountered an error', async () => {
      jest
        .spyOn(pool, 'query')
        .mockImplementationOnce(() => Promise.reject(new Error('Error')));

      expect(await service.select({ query: '*', variables: [] })).toEqual([]);
    });
  });

  describe('insert', () => {
    it('should run an insert query successfully', async () => {
      // @ts-expect-error spying on private method
      const insertSpy = jest.spyOn(service, 'runQuery');

      const result = await service.insert({
        query: 'column1, column2',
        where: '$1, $2',
        variables: ['value1', 'value2'],
      });

      expect(result).toEqual(returnResult);

      expect(insertSpy).toBeCalledWith(
        `INSERT INTO ${tableName} (column1, column2) VALUES ($1, $2) RETURNING *;`,
        ['value1', 'value2'],
      );
    });
  });

  describe('update', () => {
    it('should run an update query successfully', async () => {
      // @ts-expect-error spying on private method
      const updateSpy = jest.spyOn(service, 'runQuery');

      const result = await service.update({
        query: 'column1 = $1',
        where: 'column2 = $2',
        variables: ['value1', 'value2'],
      });

      expect(result).toEqual(returnResult);

      expect(updateSpy).toBeCalledWith(
        `UPDATE ${tableName} SET column1 = $1 WHERE column2 = $2 RETURNING *;`,
        ['value1', 'value2'],
      );
    });
  });

  describe('delete', () => {
    it('should run a delete query successfully', async () => {
      // @ts-expect-error spying on private method
      const deleteSpy = jest.spyOn(service, 'runQuery');

      const result = await service.delete({
        where: 'column1 = $1',
        variables: ['value1'],
      });

      expect(result).toEqual(returnResult);

      expect(deleteSpy).toBeCalledWith(
        `DELETE FROM ${tableName} WHERE column1 = $1 RETURNING *;`,
        ['value1'],
      );
    });
  });
});
