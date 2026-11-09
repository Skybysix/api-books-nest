import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { Book, BookRow, toBook } from './book';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksContract } from './books.contract';

@Injectable()
export class BooksService implements BooksContract  {
    constructor(private readonly pool: Pool) { } // NestJS nos da el Pool

    // GET /api/books   y   GET /api/books?author=gabriel
    // GET /api/books y sus filtros opcionales
async findAll(author?: string, maxPages?: number): Promise<Book[]> {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (author) {
    values.push(author);
    conditions.push(`author ILIKE '%' || $${values.length} || '%'`);
  }

  if (maxPages !== undefined) {
    values.push(maxPages);
    conditions.push(`pages <= $${values.length}`);
  }

  const where = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const result = await this.pool.query<BookRow>(
    `SELECT id, title, author, pages, created_at
     FROM books
     ${where}
     ORDER BY id`,
    values,
  );

  return result.rows.map(toBook);
}

    // GET /api/books/:id
    async findOne(id: number): Promise<Book> {
        const result = await this.pool.query<BookRow>(
            'SELECT id, title, author, pages, created_at FROM books WHERE id = $1',
            [id],
        );
        if (result.rows.length === 0) {
            throw new NotFoundException('Libro no encontrado'); // ninguna fila → 404
        }
        return toBook(result.rows[0]);
    }

    // POST /api/books
    async create(dto: CreateBookDto): Promise<Book> {
        const result = await this.pool.query<BookRow>(
            `INSERT INTO books (title, author, pages)
       VALUES ($1, $2, $3)
       RETURNING id, title, author, pages, created_at`,
            [dto.title, dto.author, dto.pages],
        );
        return toBook(result.rows[0]); // RETURNING nos da el libro guardado, con su id
    }

    // PATCH /api/books/:id
    async update(id: number, dto: UpdateBookDto): Promise<Book> {
        if (dto.title === undefined && dto.author === undefined && dto.pages === undefined) {
            throw new BadRequestException('Envía al menos un campo');
        }
        const book = await this.findOne(id); // 404 si no existe

        const result = await this.pool.query<BookRow>(
            `UPDATE books
       SET title = $1, author = $2, pages = $3
       WHERE id = $4
       RETURNING id, title, author, pages, created_at`,
            // ?? = "el valor nuevo; si no ha llegado, el de antes"
            [dto.title ?? book.title, dto.author ?? book.author, dto.pages ?? book.pages, id],
        );
        return toBook(result.rows[0]);
    }

    // DELETE /api/books/:id
    async remove(id: number): Promise<Book> {
        const book = await this.findOne(id); // 404 si no existe
        await this.pool.query('DELETE FROM books WHERE id = $1', [id]);
        return book; // devolvemos el libro borrado
    }
}
    