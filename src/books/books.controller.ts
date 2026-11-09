import { Controller, Get, Param, ParseIntPipe, Query, Post, Body, Patch, Delete, Put, UseGuards, } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '../auth/auth.guard';
import { EmployeeGuard } from '../auth/employee.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('books') // todas las rutas de esta clase: /api/books...
export class BooksController {
    constructor(private readonly booksService: BooksService) { } // pide el servicio

    @Get()
    findAll(
        @Query('author') author?: string,
        @Query('maxPages') maxPages?: string,
    ) {
        return this.booksService.findAll(
            author, 
            maxPages !== undefined ? Number(maxPages) : undefined,
        );
    }

    /*
    @Get('count')
    count() {
        return {
            total: this.booksService.count()
        };
    }
    */

    @Get(':id') // GET /api/books/1
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard, EmployeeGuard)
    create(@Body() dto: CreateBookDto) {
        return this.booksService.create(dto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, EmployeeGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookDto,
    ) {
        return this.booksService.update(id, dto);
    }

    /*@Put(':id')
   replace(
       @Param('id', ParseIntPipe) id: number,
       @Body() dto: CreateBookDto,
   ) {
       return this.booksService.replace(id, dto);
   }
   */

    // Solo los administradores pueden borrar libros
    @Delete(':id')
    @UseGuards(AuthGuard, AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.remove(id);
    }
}
