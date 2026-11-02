import { Controller, Post, Body, Param } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';

@Controller('api/withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post('request')
  async requestWithdrawal(@Body() payload: any) {
    return this.withdrawalsService.requestWithdrawal(payload);
  }

  @Post(':id/complete')
  async completeWithdrawal(@Param('id') id: string, @Body() payload: any) {
    return this.withdrawalsService.completeWithdrawal(id, payload);
  }
}
