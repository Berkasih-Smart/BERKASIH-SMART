import { Controller, Post, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { SystemService } from './system.service';
import { SuperAdminGuard } from '../auth/super-admin.guard';

@Controller('api/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('reset-demo')
  @HttpCode(HttpStatus.OK)
  async resetDemo() {
    return this.systemService.resetDemo();
  }

  @Post('trigger-deploy')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  async triggerDeploy(@Req() req: any) {
    return this.systemService.triggerDeploy(req.user);
  }
}
