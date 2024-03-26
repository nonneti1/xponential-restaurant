import { Controller, Post } from '@nestjs/common';
import { RestaurantService } from './restaurants.service';

@Controller('/restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Post("/init")
    init() {
        // this.restaurantService.initRestaurant()
        return "Initialized restaurant"
    }

}
