import { Transform } from 'class-transformer';
import {IsInt, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';

// Define los datos necesarios para crear un libro
export class CreateBookDto {
  // Elimina los espacios al principio y al final del título
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author!: string;

  @IsInt()
  @Min(1, { message: 'El número de páginas debe ser como mínimo 1' })
  @Max(2000)
  pages!: number;
}