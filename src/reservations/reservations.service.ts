import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Canceling, Reservation, ReservationData } from './reservations.model';
import { BookingReservationDto, CancelReservationDto } from './dto/reservation.dto';
import { RestaurantService } from '../restaurants/restaurants.service';

@Injectable()
export class ReservationsService {
    // Injecting dependency from our restaurant module
    constructor(private readonly _restaurantService: RestaurantService) { }

    // An array of object to keep track of each reservation requests
    private _reservationData: ReservationData[] = []

    /*
        Main method of this class, We'll have to call this method after open restaurant
        Start by getting restaurant open status from restaurantService and checking if it is not open, then we'll return an error to the caller with the message "Restaurant is not open yet."

        By using these false check conditions, the code will be clearer and easier to read instead of using an if-else nested block

        then we'll calculate how many tables is required from this reservation and store them in totalTableRequire number variable
        then we'll find if restaurant tables is enough for this reservation, and if it is false, then we'll return an error to the caller with the message "Not enough tables for your reservation."

        then we'll find a list of available tables from the function we created below

        we'll iterate through the number of required tables, assigning each table id to an reservedTable array to keep track of current reservation and update table status as true because it is reserved now

        then we create current reserve data and pushing into our _reservationData array

        after that, we'll create return data for caller based on the requirements.
    */
    public booking(bookingData: BookingReservationDto): Reservation {
        const restaurantOpenStatus: boolean = this._restaurantService.openStatus;

        if (restaurantOpenStatus == false) throw new Error("Restaurant is not open yet.");

        const totalTableRequire: number = this._calculateTotalTableRequire(bookingData.customerAmount);

        const isTableAvailable: boolean = this._isTableAvailable(totalTableRequire);

        if (isTableAvailable == false) throw new Error("Not enough tables for your reservation.");

        const availableTables: string[] = this._getAvailableTables();

        const reservedTable = [];

        for (let i = 0; i < totalTableRequire; i++) {
            const tableId = availableTables[i];
            reservedTable.push(tableId)

            this._restaurantService.updateTableStatus(tableId, true);
        }

        const reserveData: ReservationData = {
            bookingId: uuid(),
            customerAmount: 5,
            tables: reservedTable
        }

        this._reservationData.push(reserveData)

        const result: Reservation = {
            bookingId: reserveData.bookingId,
            reserveTables: totalTableRequire,
            remainingTables: this._getAvailableTables().length
        }

        return result
    }

    /*
        Canceling reservation method, this is simple as it seems
        Start by getting restaurant open status from restaurantService and checking if it is not open, then we'll return an error to the caller with the message "Restaurant is not open yet."
        Then we'll find if requested booking id existed in our reservation data
        If the index is less than zero then it means it doesn't exist, we'll return an erro to the caller with message "Invalid booking ID or reservation does not exist."

        Then we'll create a object variable return data containing an amount of cancelled tables and remaining tables in restaurant

        we'll iterate through the number of reserved tables, update table status as false because it is freed now and increment freedTables
        we'll remove current reservation data element in our reservation array
        then we'll get current available table amount and assign to result data

        after that, we'll return result data to the caller
    */
    public canceling(cancelingData: CancelReservationDto): Canceling {
        const restaurantOpenStatus: boolean = this._restaurantService.openStatus;

        if (restaurantOpenStatus == false) throw new Error("Restaurant is not open yet.");

        const reservationDataIndex = this._reservationData.findIndex(data => data.bookingId == cancelingData.bookingId);

        if (reservationDataIndex < 0) throw new Error("Invalid booking ID or reservation does not exist.")

        const result: Canceling = {
            freedTables: 0,
            remainingTables: 0
        }

        const currentReservationData = this._reservationData[reservationDataIndex];

        for (const key of currentReservationData.tables) {
            const tableId = key;
            this._restaurantService.updateTableStatus(tableId, false);
            result.freedTables++;
        }

        this._reservationData.splice(reservationDataIndex, 1);

        result.remainingTables = this._getAvailableTables().length

        return result;
    }

    // Method to find the amount of table requires by dividing customer amount with table size and ceiling value to match the requirement eg."for a group of 6 people, 2 tables will be allocated, one table for 4 people and another one for the rest."
    private _calculateTotalTableRequire(customerAmount: number): number {
        const tableSize = this._restaurantService.tableSize;
        return Math.ceil(customerAmount / tableSize)
    }

    // Method to find if current table in restaurant is enough for reservation
    private _isTableAvailable(totalTableRequire: number): boolean {
        let availableCount = 0;
        const restuarantTableStatus = this._restaurantService.restaurantTables;
        for (const table in restuarantTableStatus) {
            if (restuarantTableStatus[table] == false) availableCount++
        }
        return availableCount >= totalTableRequire;
    }

    // Method to find the list of table id from restaurantTables by filtering table status equals to false
    private _getAvailableTables(): string[] {
        const restuarantTableStatus = this._restaurantService.restaurantTables;
        const availableTables = Object.entries(restuarantTableStatus)
            .filter(([tableNumber, status]) => status === false)
            .map(([tableNumber, status]) => tableNumber);
        return availableTables;
    }

}
