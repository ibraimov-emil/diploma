import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {AuthMiddleware} from "./auth/auth.middleware";
import {ChatsGateway} from "./chats/chats.gateway";
import { WsAdapter } from '@nestjs/platform-ws'


async function start() {
    const logger = new Logger('Bootstrap');
    const PORT = process.env.PORT || 5000;
    
    logger.log(`Starting application with NODE_ENV=${process.env.NODE_ENV}`);
    
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Apply cookie parser middleware
    app.use(cookieParser());
    
    // Configure CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Authorization']
    });
    
    // Configure WebSockets
    app.useWebSocketAdapter(new WsAdapter(app));
    
    // Configure Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Digital-agency')
        .setDescription('Сервис для оказания услуг по разработке, сопровождению, консалтингу в IT сфере')
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

    // Apply global pipes
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));

    await app.listen(PORT, () => logger.log(`Server started on port = ${PORT}`));
}

start().catch(err => {
    const logger = new Logger('Bootstrap');
    logger.error(`Failed to start application: ${err.message}`, err.stack);
});
