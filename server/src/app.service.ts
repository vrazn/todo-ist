import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  get(): { status: string } {
    return { status: 'running' };
  }
}
