import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class BookingReservationDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    customerAmount: number;
}

export class CancelReservationDto {
    @IsString()
    @IsNotEmpty()
    bookingId: string;
}