import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {AuthMiddleware} from "./auth/auth.middleware";


async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser());
    app.enableCors({
        // origin: "localhost:3000",
        origin:'http://localhost:3000',
        credentials: true
    });
    // app.use(AuthMiddleware);
    const config = new DocumentBuilder()
        .setTitle('Digital-agency')
        .setDescription('Сервис по оказанию услуг по разработке, поддержку, консалтингу в IT сфере')
        .setVersion('1.0.0')
        .addBearerAuth()
        // .addTag(Emil Dev')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        }
    })

    app.useGlobalPipes(new ValidationPipe())

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

start()
