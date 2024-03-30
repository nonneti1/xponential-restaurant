import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsController } from './restaurants/restaurants.controller';
import { ReservationsModule } from './reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { ReservationsController } from './reservations/reservations.controller';

@Module({
  imports: [RestaurantsModule, ReservationsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, RestaurantsController, ReservationsController],
  providers: [AppService],
})
export class AppModule { }
