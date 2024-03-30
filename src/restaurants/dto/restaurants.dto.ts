import { IsNotEmpty, IsNumber, IsPositive, Max } from "class-validator";

export class InitRestaurantDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @Max(100)
    tableAmount: number;
}