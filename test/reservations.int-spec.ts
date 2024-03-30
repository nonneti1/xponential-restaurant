import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';

describe('ReservationController integration testing', () => {
    let app: INestApplication;
    let appHttpServer = null;
    const validRestaurantBody = { tableAmount: 5 }
    const validReservationBody = { customerAmount: 4 }
    const fourCustomerReservationBody = { customerAmount: 4 }
    const fiveCustomerReservationBody = { customerAmount: 5 }
    const fiftteenCustomerReservationBody = { customerAmount: 15 }
    const tenCustomerReservationBody = { customerAmount: 10 }

    let bookingId: string = "";

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

    it('Should return error restaurant is not open', async () => {
        const test = await request(appHttpServer)
            .post('/reservations/reserve')
            .send(validReservationBody)
            .expect(400)

        expect(test.body.message).toEqual("Error while booking a reservation")
        expect(test.body.error).toEqual("BadRequest Error: Restaurant is not open yet.")
    });

    it('Should return success reservation for 4 customers', async () => {
        await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody)

        const test = await request(appHttpServer)
            .post('/reservations/reserve')
            .send(fourCustomerReservationBody)
            .expect(201)

        expect(test.body.message).toEqual("Reservation created")
        expect(typeof test.body.data.bookingId).toBe("string")
        expect(test.body.data.reserveTables).toEqual(1)
        expect(test.body.data.remainingTables).toEqual(4)
    });

    it('Should return success reservation for 5 customers', async () => {
        await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody)

        const test = await request(appHttpServer)
            .post('/reservations/reserve')
            .send(fiveCustomerReservationBody)
            .expect(201)

        bookingId = test.body.data.bookingId;

        expect(test.body.message).toEqual("Reservation created")
        expect(typeof test.body.data.bookingId).toBe("string")
        expect(test.body.data.reserveTables).toEqual(2)
        expect(test.body.data.remainingTables).toEqual(2)
    });

    it('Should return error not enough table for reservation', async () => {
        await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody)

        const test = await request(appHttpServer)
            .post('/reservations/reserve')
            .send(tenCustomerReservationBody)
            .expect(400)

        expect(test.body.message).toEqual("Error while booking a reservation")
        expect(test.body.error).toEqual("BadRequest Error: Not enough tables for your reservation.")
    });

    it('Should return error invalid booking id for cancellation', async () => {
        await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody)

        const test = await request(appHttpServer).post('/reservations/cancel').send({ bookingId: "testBookingId" }).expect(400)

        expect(test.body.message).toEqual("Error while canceling a reservation")
        expect(test.body.error).toEqual("BadRequest Error: Invalid booking ID or reservation does not exist.")
    })

    it('Should return success cancel reservation', async () => {
        await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody)

        const test = await request(appHttpServer).post('/reservations/cancel').send({ bookingId: bookingId }).expect(201)

        expect(test.body.message).toEqual("Reservation cancelled")
        expect(test.body.data.freedTables).toEqual(2)
        expect(test.body.data.remainingTables).toEqual(4)
    })

    it('Should return success reservation for 15 customers', async () => {
        await request(appHttpServer).post('/restaurants/init').send(validRestaurantBody)

        const test = await request(appHttpServer)
            .post('/reservations/reserve')
            .send(fiftteenCustomerReservationBody)
            .expect(201)

        expect(test.body.message).toEqual("Reservation created")
        expect(typeof test.body.data.bookingId).toBe("string")
        expect(test.body.data.reserveTables).toEqual(4)
        expect(test.body.data.remainingTables).toEqual(0)
    });

});
