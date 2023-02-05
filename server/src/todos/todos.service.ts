import { Injectable } from '@nestjs/common';

import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return { id: 1, title: 'Test', isDone: false };
  }

  async findAll(): Promise<Todo[]> {
    return [];
  }

  async findOne(id: number): Promise<Todo> {
    return { id, title: 'Test', isDone: false };
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return { id, title: 'Test', isDone: false };
  }

  async remove(id: number): Promise<Todo> {
    return { id, title: 'Test', isDone: false };
  }
}
