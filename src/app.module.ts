import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module';
import { SystemModule } from './modules/system/system.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [
    DatabaseModule,
    BootstrapModule,
    SystemModule,
    DepositsModule,
    WithdrawalsModule,
    SalesModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

