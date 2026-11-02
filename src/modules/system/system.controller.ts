import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('api/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('reset-demo')
  @HttpCode(HttpStatus.OK)
  async resetDemo() {
    return this.systemService.resetDemo();
  }
}
