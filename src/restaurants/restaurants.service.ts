import { Injectable } from '@nestjs/common';
import { Restaurant, RestaurantTableStatus } from './restaurants.model';
import { InitRestaurantDto } from './dto/restaurants.dto';

@Injectable()
export class RestaurantService {
    /* 
    Create a properties to store required values based on given specs

    _tableSize for quick accessing from enviroment variable TABLE_SEAT.
    _openStatus to store restaurant open status, This will be used across the application.
    _restaurantTables to keeping track of table if it's reserved, I used key-value pair by using table id as a key and a boolean as status true = reserved and false = available.  

    */
    private _tableSize: number = parseInt(process.env.TABLE_SEAT);
    private _openStatus: boolean = false;
    private _restaurantTables: RestaurantTableStatus = {};

    // Getter methods for private properties
    public get tableSize(): number {
        return this._tableSize;
    }

    public get openStatus(): boolean {
        return this._openStatus;
    }

    public get restaurantTables(): RestaurantTableStatus {
        return this._restaurantTables;
    }

    // Method to update table status eg. a new reservation from a customer then this method will be called and updated said table id, require 2 params table id string and table status boolean
    public updateTableStatus(tableId: string, status: boolean): void {
        if (this._restaurantTables[tableId] != null) {
            this._restaurantTables[tableId] = status
        }
    }

    /* Main method of this class, We'll have to call this method first before doing anything in this application
       Start by check if openStatus is false then we'll proceed to set openStatus true
       then we'll assign each table id and status to our _restaurantTables property using for loop while the number of loops is less than fixed table amount from our TABLE_SEAT in .env
       after that we'll return restaurantData(tableAmount) and isOpen flag to caller

       if openStatus is already true then we'll return error to caller with message "Restaurant is already open"
    */
    public initRestaurant(restaurantData: InitRestaurantDto): Restaurant {
        const openStatus = this.openStatus;
        if (!openStatus) {
            this._openStatus = true;
            for (let i = 0; i < restaurantData.tableAmount; i++) {
                this._restaurantTables[i + 1] = false
            }

            return {
                ...restaurantData,
                isOpen: this._openStatus
            }
        }
        throw new Error("Restaurant is already open")
    }
}
