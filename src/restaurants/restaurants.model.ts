// Interface used in restaurant service for returing value from initRestaurant()
export interface Restaurant {
    tableAmount: number;
    isOpen: boolean;
}

// Interface used in restaurant service containing key-value pair as tableId and boolean
export interface RestaurantTableStatus {
    [tableId: string]: boolean
}