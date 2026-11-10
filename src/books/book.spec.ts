import { BookRow, toBook } from './book';

describe('toBook', () => { // describe: agrupa los tests de una cosa
    it('convierte una fila de la base de datos en un libro de la API', () => { // it: un test
        // 1. Preparar: una fila como las que devuelve PostgreSQL
        const row: BookRow = {
            id: 1,
            title: 'Momo',
            author: 'Michael Ende',
            pages: 256,
            created_at: new Date('2026-01-01'),
        };

        // 2. Ejecutar
        const book = toBook(row);

        // 3. Comprobar: expect(lo que ha salido).toEqual(lo que esperaba)
        expect(book).toEqual({
            id: 1,
            title: 'Momo',
            author: 'Michael Ende',
            pages: 256,
            createdAt: new Date('2026-01-01'),
        });
    });
    it('no incluye la propiedad created_at', () => {
        const row: BookRow = {
            id: 1,
            title: 'Momo',
            author: 'Michael Ende',
            pages: 256,
            created_at: new Date('2026-01-01'),
        };

        const book = toBook(row);

        expect(book).not.toHaveProperty('created_at');
    });
});