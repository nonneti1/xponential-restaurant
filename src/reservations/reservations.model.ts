// Interface used in reservation service, define a structure for returning data from booking method
export interface Reservation {
    bookingId: string;
    reserveTables: number;
    remainingTables: number;
}

// Interface used in reservation service, define a structure for returning data from canceling method
export interface Canceling {
    freedTables: number;
    remainingTables: number;
}

// Interface used in reservation service, define a structure to keep track of reservation 
export interface ReservationData {
    bookingId: string;
    customerAmount: number;
    tables: string[]
}