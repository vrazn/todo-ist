import { Test, TestingModule } from '@nestjs/testing';

import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

import { createDatabaseProviderToken } from '../database/database.provider';

const createDto: CreateTodoDto = {
  title: 'Test',
  isImportant: false,
};

const todoStub: Todo = {
  id: 1,
  title: 'Test',
  description: null,
  isImportant: false,
  isDone: false,
  dueDate: null,
};

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
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(todoStub));

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(todoStub);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should return the result of TodosService.findAll', async () => {
      const findAllStub: Todo[] = [todoStub];

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
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(todoStub));

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe(todoStub);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should return the result of TodosService.update', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(todoStub));

      const result = await controller.update(1, todoStub);

      expect(service.update).toHaveBeenCalledWith(1, todoStub);
      expect(result).toBe(todoStub);
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(controller.remove).toBeDefined();
    });

    it('should return the result of TodosService.remove', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(todoStub));

      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBe(todoStub);
    });
  });
});
