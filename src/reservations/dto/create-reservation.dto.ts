import { IsString, IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  eventId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
