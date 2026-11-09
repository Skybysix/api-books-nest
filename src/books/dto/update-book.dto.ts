import {
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

// En PATCH los campos son opcionales,
// pero si llegan tienen que ser válidos.
export class UpdateBookDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(1)
  pages?: number;
}