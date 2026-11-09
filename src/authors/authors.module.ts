import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}