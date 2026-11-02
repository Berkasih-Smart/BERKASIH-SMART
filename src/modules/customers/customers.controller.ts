import { Controller, Post, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('api/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(@Body() payload: any) {
    return this.customersService.createCustomer(payload);
  }
}
