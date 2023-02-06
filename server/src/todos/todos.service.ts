import { Injectable, NotFoundException } from '@nestjs/common';
import { snakeCase } from 'change-case';

import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseTable } from '../database/database.decorator';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TodosService {
  constructor(
    @DatabaseTable('todos')
    private readonly db: DatabaseService<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { keys, values, indexes } = Object.keys(createTodoDto).reduce(
      (acc, key, index) => {
        acc.keys.push(snakeCase(key));
        acc.values.push(createTodoDto[key as keyof CreateTodoDto]);
        acc.indexes.push(`$${index + 1}`);
        return acc;
      },
      { keys: [], values: [], indexes: [] } as {
        keys: string[];
        values: string[];
        indexes: string[];
      },
    );

    const [result] = await this.db.insert({
      query: keys.join(', '),
      where: indexes.join(', '),
      variables: values,
    });
    return result;
  }

  async findAll(): Promise<Todo[]> {
    return this.db.select({ query: '*', variables: [] });
  }

  async findOne(id: number): Promise<Todo> {
    const [result] = await this.db.select({
      query: '*',
      where: 'id = $1',
      variables: [id],
    });

    if (!result) throw new NotFoundException();
    return result;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const keys = Object.keys(updateTodoDto);
    const values = Object.values(updateTodoDto);

    const query = keys
      .map((key, index) => `${snakeCase(key)} = $${index + 1}`)
      .join(', ');

    const [result] = await this.db.update({
      query,
      where: `id = $${keys.length + 1}`,
      variables: [...values, id],
    });

    return result;
  }

  async remove(id: number): Promise<Todo> {
    const [result] = await this.db.delete({
      where: 'id = $1',
      variables: [id],
    });

    return result;
  }
}
