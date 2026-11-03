import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('api/health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get('privacy')
  getPrivacy(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'public', 'privacy', 'index.html'));
  }
}
