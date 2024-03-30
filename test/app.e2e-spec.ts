import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TransformInterceptor } from '../src/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';

describe('End-to-End testing', () => {
  let app: INestApplication;
  let appHttpServer = null;
  let bookingId = "";
  const validRestaurantBody = { tableAmount: 5 };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor(new Reflector()))
    await app.init();
    appHttpServer = app.getHttpServer();
  });

  it('Open restaurant with 5 tables', async () => {
    const test = await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody).expect(201)

    expect(test.body.message).toEqual("Restaurant initialized")
    expect(test.body.data).toStrictEqual({})
  })

  it('Reservation for 5 customers', async () => {
    const test = await request(appHttpServer).post('/reservations/reserve').send({ customerAmount: 5 }).expect(201)

    expect(test.body.message).toEqual("Reservation created")
    expect(typeof test.body.data.bookingId).toBe("string")
    expect(test.body.data.reserveTables).toEqual(2)
    expect(test.body.data.remainingTables).toEqual(3)
  })

  it('Reservation for 10 customers', async () => {
    const test = await request(appHttpServer).post('/reservations/reserve').send({ customerAmount: 10 }).expect(201)
    bookingId = test.body.data.bookingId;
    expect(test.body.message).toEqual("Reservation created")
    expect(typeof test.body.data.bookingId).toBe("string")
    expect(test.body.data.reserveTables).toEqual(3)
    expect(test.body.data.remainingTables).toEqual(0)
  })

  it('Cancel last reservation', async () => {
    const test = await request(appHttpServer).post('/reservations/cancel').send({ bookingId: bookingId }).expect(201)

    expect(test.body.message).toEqual("Reservation cancelled")
    expect(test.body.data.freedTables).toEqual(3)
    expect(test.body.data.remainingTables).toEqual(3)
  })

});
