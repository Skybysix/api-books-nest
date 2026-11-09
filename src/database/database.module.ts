import { Module } from '@nestjs/common';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: Pool, // Cuando alguien pida un Pool...
      useFactory: () =>
        new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
    },
  ],
  exports: [Pool], // Permitimos que otros módulos utilicen el Pool
})
export class DatabaseModule {}