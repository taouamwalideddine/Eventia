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

  @IsDate()
  date: Date;

  @IsString()
  time: string;

  @IsInt()
  @Min(1)
  capacity: number;
}
