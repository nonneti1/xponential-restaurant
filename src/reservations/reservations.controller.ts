import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { BookingReservationDto, CancelReservationDto } from './dto/reservation.dto';
import { Canceling, Reservation } from './reservations.model';
import { ResponseMessage } from '../decorators/response_message.decorator';
import { RestaurantService } from '../restaurants/restaurants.service';

@Controller('/reservations')
export class ReservationsController {
    constructor(private readonly _reservationService: ReservationsService) { }

    /* POST API enpoint to make a reservation
    Requires body {
        customerAmount:number
    }
    return reserved data and response message
    */
    @Post("/reserve")
    @ResponseMessage('Reservation created')
    reserve(@Body() BookingReservationDto: BookingReservationDto) {
        try {


            const result: Reservation = this._reservationService.booking(BookingReservationDto)
            return result
        } catch (error) {
            throw new BadRequestException('Error while booking a reservation', { cause: error, description: `BadRequest ${error}` })
        }
    }

    /* POST API enpoint to cancel a reservation 
    Requires body {
        bookingId:string
    }
    return canceling data and response message
    */
    @Post("/cancel")
    @ResponseMessage('Reservation cancelled')
    cancel(@Body() CancelReservationDto: CancelReservationDto) {
        try {
            const result: Canceling = this._reservationService.canceling(CancelReservationDto);
            return result
        } catch (error) {
            throw new BadRequestException('Error while canceling a reservation', { cause: error, description: `BadRequest ${error}` })
        }
    }

}
