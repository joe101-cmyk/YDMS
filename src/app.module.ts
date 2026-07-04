import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';
import { auth_module } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MailModule } from './mail/mail.module';

@Module({
      imports: [ConfigModule.forRoot({
        isGlobal:true,
        envFilePath:path.resolve("./config/.env"),
      }),
      MongooseModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory:async(ConfigService:ConfigService)=>({
          uri:ConfigService.get<string>("DB_URI"),
          onConnectionCreate:(conncetion:Connection)=>{
            conncetion.on("connected_DB",()=>{
              console.log(`DB Running ` );
              
            })
          }
        })
      }),
    auth_module,
    MailModule,
  ],
    controllers: [AppController],
  providers: [AppService],
      

})
export class AppModule {}
