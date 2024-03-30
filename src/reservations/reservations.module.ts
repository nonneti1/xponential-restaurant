import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
    imports: [RestaurantsModule],
    providers: [ReservationsService],
    controllers: [ReservationsController],
    exports: [ReservationsService],
})
export class ReservationsModule { }
