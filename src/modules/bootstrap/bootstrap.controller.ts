import { Controller, Get } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';

@Controller('api/bootstrap')
export class BootstrapController {
  constructor(private readonly bootstrapService: BootstrapService) {}

  @Get()
  async getBootstrap() {
    return this.bootstrapService.getSnapshot();
  }
}
