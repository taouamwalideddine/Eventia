import { IsString, IsInt, IsDate, Min, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;

  @IsString()
  @MaxLength(255)
  location: string;

  @IsString()
  date: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsInt() // Or IsNumber() if decimal is allowed as input
  @Min(0)
  price: number;
}
