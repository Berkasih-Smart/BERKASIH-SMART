import { Controller, Post, Body } from '@nestjs/common';
import { DepositsService } from './deposits.service';

@Controller('api/deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  async createDeposit(@Body() payload: any) {
    return this.depositsService.createDeposit(payload);
  }
}
