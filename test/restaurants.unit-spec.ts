import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from '../src/restaurants/restaurants.service';

describe('RestaurantsService', () => {
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantService]
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize restaurant tables', () => {
    const restaurant = service.initRestaurant({
      tableAmount: 5
    });

    expect(restaurant).toEqual({
      tableAmount: 5,
      isOpen: true
    })
  })
});
