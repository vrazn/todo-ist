import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string | null;

  // Skips further checks if value is `undefined`,
  // but runs them for `null` values
  @ValidateIf((o) => 'isImportant' in o)
  @IsBoolean()
  isImportant?: boolean;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}
