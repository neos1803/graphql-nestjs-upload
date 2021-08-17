import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from "graphql-upload";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(graphqlUploadExpress({
    maxFileSize: 100000000,
    maxFiles: 2
  }));
  const port = process.env.PORT;
  await app.listen(port || 3007);
}
bootstrap();
