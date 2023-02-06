import { Test, TestingModule } from '@nestjs/testing';

import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

import { createDatabaseProviderToken } from '../database/database.provider';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        {
          provide: createDatabaseProviderToken('todos'),
          useValue: {
            select: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should return the result of TodosService.create', async () => {
      const createDto: CreateTodoDto = {
        title: 'Test',
      };
      const createStub: Todo = {
        id: 1,
        title: 'Test',
        isDone: false,
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(createStub));

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createStub);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should return the result of TodosService.findAll', async () => {
      const findAllStub: Todo[] = [{ id: 1, title: 'Test', isDone: false }];

      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(findAllStub));

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith();
      expect(result).toBe(findAllStub);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });

    it('should return the result of TodosService.findOne', async () => {
      const findOneStub: Todo = {
        id: 1,
        title: 'Test',
        isDone: false,
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(findOneStub));

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe(findOneStub);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return the result of TodosService.update', async () => {
      const updateStub: Todo = {
        id: 1,
        title: 'Test',
        isDone: false,
      };

      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(updateStub));

      const result = await controller.update(1, updateStub);

      expect(service.update).toHaveBeenCalledWith(1, updateStub);
      expect(result).toBe(updateStub);
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(controller.remove).toBeDefined();
    });

    it('should return the result of TodosService.remove', async () => {
      const removeStub: Todo = {
        id: 1,
        title: 'Test',
        isDone: false,
      };

      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(removeStub));

      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBe(removeStub);
    });
  });
});
