import { Injectable } from '@nestjs/common';
import { BooksService } from '../books/books.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly booksService: BooksService) {}

  async findAll(): Promise<string[]> {
    // Obtenemos todos los libros y esperamos a que lleguen
    const books = await this.booksService.findAll();

    // Extraemos los nombres de los autores
    const authors = books.map((book) => book.author);

    // Eliminamos los autores repetidos
    return [...new Set(authors)];
  }
}