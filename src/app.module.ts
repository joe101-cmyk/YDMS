import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { UploadsModule } from './uploads/uploads.module';
import { appConfig } from './common/config/app.config';
import { MailModule } from './mail/mail.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './config/.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI') || appConfig.mongodbUri,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      autoSchemaFile:join(process.cwd(),"src/schema.gql"),
      sortSchema:true,
      context:({req})=>({req})
    }),
    AuthModule,
    UsersModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    ReviewModule,
    CartModule,
    CouponModule,
    OrderModule,
    UploadsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
