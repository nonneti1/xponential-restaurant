import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantService } from './restaurants.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantsModule {
}
