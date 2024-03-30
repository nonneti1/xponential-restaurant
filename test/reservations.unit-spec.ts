import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from '../src/reservations/reservations.service';
import { RestaurantService } from '../src/restaurants/restaurants.service';

describe('ReservationsService', () => {
  let reservationService: ReservationsService;
  let restaurantService: RestaurantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationsService, RestaurantService],
    }).compile();

    reservationService = module.get<ReservationsService>(ReservationsService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(reservationService).toBeDefined();
  });

  it('should throw an error restaurant is not open', () => {
    const test = () => reservationService.booking({ customerAmount: 5 })
    expect(test).toThrowError("Restaurant is not open yet.")
  })

  it('should return success reservation', () => {
    restaurantService.initRestaurant({ tableAmount: 5 });
    const test = reservationService.booking({ customerAmount: 5 });

    expect(typeof test.bookingId).toBe("string")
    expect(test.reserveTables).toEqual(2)
    expect(test.remainingTables).toEqual(3)
  })

  it('should throw an error not enough table', () => {
    const reservation = () => reservationService.booking({ customerAmount: 999 });
    expect(reservation).toThrowError("Not enough tables for your reservation.")
  })
});
