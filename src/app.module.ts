import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/resources/schema.gql'),
      playground: true,
      debug: false,
      uploads: false
    }),
  ],
  providers: [
    AppResolver,
  ],
})
export class AppModule {}
