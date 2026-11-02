import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { SeedService } from './seed.service';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

describe('Database & SeedService', () => {
  let moduleRef: TestingModule;
  let seedService: SeedService;
  let dataSource: DataSource;
  const testDbFile = path.join(process.cwd(), 'database.sqlite');

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    seedService = moduleRef.get<SeedService>(SeedService);
    dataSource = moduleRef.get<DataSource>(DataSource);
    await moduleRef.init();
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('should initialize SQLite database and seed initial data', async () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(fs.existsSync(testDbFile)).toBe(true);

    const userCount = await dataSource.getRepository('User').count();
    expect(userCount).toBeGreaterThan(0);

    const customerCount = await dataSource.getRepository('Customer').count();
    expect(customerCount).toBeGreaterThan(0);

    const wasteTypeCount = await dataSource.getRepository('WasteType').count();
    expect(wasteTypeCount).toBeGreaterThan(0);
  });
});
