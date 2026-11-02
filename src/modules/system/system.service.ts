import { Injectable } from '@nestjs/common';
import { SeedService } from '../../database/seed.service';

@Injectable()
export class SystemService {
  constructor(private readonly seedService: SeedService) {}

  async resetDemo() {
    await this.seedService.runSeed();
    return { success: true, message: 'Database reset to verified demo seed' };
  }
}
