import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [
    DatabaseModule,
    BootstrapModule,
    SystemModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

