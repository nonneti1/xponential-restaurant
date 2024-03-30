import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';

describe('RestaurantController integration testing', () => {
    let app: INestApplication;
    let appHttpServer = null;
    const validBody = { tableAmount: 5 }
    const invalidBody = { tableAmount: -1 }
    const limitExceedBody = { tableAmount: 101 }

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

    it('Should return error tableAmount is not positive', async () => {
        const test = await request(appHttpServer)
            .post('/restaurants/init')
            .send(invalidBody)
            .expect(400)

        expect(test.body.message[0]).toEqual("tableAmount must be a positive number")
    });

    it('Should return error tableAmount must not be greater than 100', async () => {
        const test = await request(appHttpServer)
            .post('/restaurants/init')
            .send(limitExceedBody)
            .expect(400)

        expect(test.body.message[0]).toEqual("tableAmount must not be greater than 100")
    });

    it('Should return success initialize restaurant', async () => {
        const test = await request(appHttpServer)
            .post('/restaurants/init')
            .send(validBody)
            .expect(201)

        expect(test.body.message).toEqual("Restaurant initialized")
        expect(test.body.data).toStrictEqual({})
    });

    it('Should return error restaurant is already open', async () => {
        const test = await request(appHttpServer)
            .post('/restaurants/init')
            .send(validBody)
            .expect(400)

        expect(test.body.message).toEqual("Error while initializing restaurant")
        expect(test.body.error).toEqual("BadRequest Error: Restaurant is already open")
    });
});
