import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { RestaurantService } from './restaurants.service';
import { InitRestaurantDto } from './dto/restaurants.dto'
import { ResponseMessage } from '../decorators/response_message.decorator';

@Controller('/restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantService: RestaurantService) { }

    /* POST API enpoint to initialize the restaurant 
    Requires body {
        tableAmount:number
    }
    return empty data and response message
    */
    @Post("/init")
    @ResponseMessage('Restaurant initialized')
    init(@Body() initRestaurantDto: InitRestaurantDto) {
        try {
            this.restaurantService.initRestaurant(initRestaurantDto);
            return {}
        } catch (error) {
            throw new BadRequestException('Error while initializing restaurant', { cause: error, description: `BadRequest ${error}` })
        }
    }
}
