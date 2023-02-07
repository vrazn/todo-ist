import { Test, TestingModule } from '@nestjs/testing';

import { TodosService } from './todos.service';
import { createDatabaseProviderToken } from '../database/database.provider';
import { DatabaseService } from 'src/database/database.service';
import { Todo } from './entities/todo.entity';

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

describe('TodosService', () => {
  let service: TodosService;
  let db: DatabaseService<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: createDatabaseProviderToken('todos'),
          useValue: {
            select: jest.fn().mockImplementation(() => returnResult),
            insert: jest.fn().mockImplementation(() => returnResult),
            update: jest.fn().mockImplementation(() => returnResult),
            delete: jest.fn().mockImplementation(() => returnResult),
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    db = module.get<DatabaseService<Todo>>(
      createDatabaseProviderToken('todos'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should return all results of db.select', async () => {
      const selectSpy = jest.spyOn(db, 'select');

      const result = await service.findAll();

      expect(selectSpy).toBeCalledWith({
        query: '*',
        variables: [],
      });

      expect(result).toEqual(returnResult);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should return the first result of db.select', async () => {
      const selectSpy = jest.spyOn(db, 'select');

      const result = await service.findOne(1);

      expect(selectSpy).toBeCalledWith({
        query: '*',
        where: 'id = $1',
        variables: [1],
      });

      expect(result).toEqual(returnResult[0]);
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should return the result of db.insert', async () => {
      const createSpy = jest.spyOn(db, 'insert');

      const result = await service.create({
        title: 'Test',
        isImportant: false,
      });

      expect(createSpy).toBeCalledWith({
        query: 'title, is_important',
        where: '$1, $2',
        variables: ['Test', false],
      });

      expect(result).toEqual(returnResult[0]);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should return the result of db.update', async () => {
      const updateSpy = jest.spyOn(db, 'update');

      const result = await service.update(1, { title: 'Test' });

      expect(updateSpy).toBeCalledWith({
        query: 'title = $1',
        where: 'id = $2',
        variables: ['Test', 1],
      });

      expect(result).toEqual(returnResult[0]);
    });

    it('should handle camelCase to snake_case conversion', async () => {
      const updateSpy = jest.spyOn(db, 'update');

      const result = await service.update(1, { isDone: true });

      expect(updateSpy).toBeCalledWith({
        query: 'is_done = $1',
        where: 'id = $2',
        variables: [true, 1],
      });

      expect(result).toEqual(returnResult[0]);
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(service.remove).toBeDefined();
    });

    it('should return the result of db.delete', async () => {
      const deleteSpy = jest.spyOn(db, 'delete');

      const result = await service.remove(1);

      expect(deleteSpy).toBeCalledWith({
        where: 'id = $1',
        variables: [1],
      });

      expect(result).toEqual(returnResult[0]);
    });
  });
});
