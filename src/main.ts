import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { HttpExceptionFilter } from './filters/http-exception.filter'

async function bootstrap() {
  const port = process.env.PORT as string
  const app = await NestFactory.create(AppModule)
  const logger = new Logger()
  const globalPrefix = '/api'
  app.enableCors()

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  )

  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  //app.useGlobalInterceptors(new SnakeCaseInterceptor());
  //app.useGlobalFilters(new QueryErrorFilter());

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Store')
      .setDescription('The Product Store API description')
      .setVersion('1.0')
      .setExternalDoc('Download Postman-Collection', `http://localhost:${port}/api/docs-json`)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Bearer',
        },
        'access-token',
      )
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  }

  await app.listen(port)

  let baseUrl = app.getHttpServer().address().address
  if (baseUrl === '0.0.0.0' || baseUrl === '::') {
    baseUrl = 'localhost'
  }
  logger.log(`Listening to http://${baseUrl}:${port}${globalPrefix} `)

  if (process.env.NODE_ENV === 'development') {
    logger.log(`Swagger UI: http://${baseUrl}:${port}${globalPrefix}/docs`)
  }
}
bootstrap()
