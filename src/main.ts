import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Automatically transforms request data to DTO classes
            whitelist: true, // Strips properties that are not part of the DTO
            forbidNonWhitelisted: true, // Throws an error if any extra properties are present
        })
    );

    // Set up Swagger
    const config = new DocumentBuilder()
        .setTitle('Vinyl Store')
        .setDescription('The API documentation for Vinyl Store')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.use(
        json({
            verify: (req: any, res, buf) => {
                req.rawBody = buf;
            },
        })
    );

    await app.listen(3000);
}
bootstrap();
