import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SeedService } from '../../database/seed.service';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

@Injectable()
export class SystemService {
  constructor(
    private readonly seedService: SeedService,
    private readonly dataSource: DataSource,
  ) {}

  async resetDemo() {
    await this.seedService.runSeed();
    return { success: true, message: 'Database reset to verified demo seed' };
  }

  async triggerDeploy(user: any) {
    const webhookUrl = process.env.AAPANEL_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new BadRequestException('AAPANEL_WEBHOOK_URL belum dikonfigurasi di environment server.');
    }

    const result = await this.callWebhook(webhookUrl);

    // Record to audit logs in SQLite
    try {
      const auditRepo = this.dataSource.getRepository('AuditLog');
      await auditRepo.save({
        id: `log-${Date.now()}`,
        user: user?.name || 'Super Admin',
        role: user?.role || 'SUPER_ADMIN',
        action: 'TRIGGER_DEPLOY',
        entity: 'SYSTEM',
        entity_id: 'aapanel-webhook',
        old_value: 'Production version',
        new_value: 'Triggered update via aaPanel Webhook',
        timestamp: new Date().toISOString(),
        ip_address: '127.0.0.1',
      });
    } catch (err) {
      console.warn('Gagal mencatat audit log deploy:', err);
    }

    return {
      success: true,
      message: 'Sinyal deployment berhasil dikirim ke aaPanel.',
      statusCode: result.statusCode,
      response: result.response,
    };
  }

  private callWebhook(webhookUrl: string): Promise<{ statusCode: number; response: string }> {
    return new Promise((resolve, reject) => {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(webhookUrl);
      } catch (err) {
        return reject(new BadRequestException('Format AAPANEL_WEBHOOK_URL tidak valid.'));
      }

      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const req = client.request(
        webhookUrl,
        {
          method: 'GET',
          rejectUnauthorized: false, // Bypass self-signed SSL certificate for local aaPanel IP
          timeout: 15000,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode || 200,
              response: data,
            });
          });
        },
      );

      req.on('error', (err) => {
        reject(
          new HttpException(
            `Gagal menghubungi webhook aaPanel: ${err.message}`,
            HttpStatus.BAD_GATEWAY,
          ),
        );
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new HttpException('Waktu koneksi ke webhook aaPanel habis (timeout).', HttpStatus.GATEWAY_TIMEOUT));
      });

      req.end();
    });
  }
}
