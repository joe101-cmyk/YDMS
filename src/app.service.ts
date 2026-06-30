import { Get, Injectable, Param, Response } from '@nestjs/common';


@Injectable()

export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createProduct() {
    return {
      message: 'Found All',
    };
  }

  findOne(id: string) {
    return `Id params = ${id}`;
  }
}

