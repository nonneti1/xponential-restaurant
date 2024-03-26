import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsController } from './restaurants/restaurants.controller';

@Module({
  imports: [RestaurantsModule],
  controllers: [AppController, RestaurantsController],
  providers: [AppService],
})
export class AppModule { }
