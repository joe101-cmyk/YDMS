import { Controller, Get, HttpCode, Param, Post, Query, Req, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { MESSAGES } from '@nestjs/core/constants';
import { log } from 'console';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

     @Get('products')
  createProduct() {
    return this.appService.createProduct();
  }

  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }


}