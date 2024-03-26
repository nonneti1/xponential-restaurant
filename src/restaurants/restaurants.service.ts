import { Injectable } from '@nestjs/common';
import { Restaurant } from './restaurants.model';

export interface RestaurantInput {
    tableAmount: number
}

export interface RestaurantTables {
    reservationId: string;
    customerAmount: number;
}

@Injectable()
export class RestaurantService {
    private _isRestaurantOpen: boolean = false;
    private _restaurantTables: RestaurantTables[] = null;

    public initRestaurant(restaurantData: RestaurantInput): Restaurant {
        this._isRestaurantOpen = true;
        this._restaurantTables = Array(restaurantData.tableAmount).fill({ reservationId: "", customerAmount: 0 })

        return {
            ...restaurantData,
            created: this._isRestaurantOpen
        }
    }
}
