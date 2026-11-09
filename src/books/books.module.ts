import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from '../auth/admin.guard';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [BooksController],
  providers: [BooksService, AdminGuard],
  exports: [BooksService],
})
export class BooksModule { }
