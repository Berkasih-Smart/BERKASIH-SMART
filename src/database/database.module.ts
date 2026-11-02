import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ALL_ENTITIES } from './entities';
import { SeedService } from './seed.service';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(process.cwd(), 'database.sqlite'),
      entities: ALL_ENTITIES,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  providers: [SeedService],
  exports: [TypeOrmModule, SeedService],
})
export class DatabaseModule {}
