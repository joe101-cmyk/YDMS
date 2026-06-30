import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { auth_module } from './auth/auth.module';

@Module({
      imports: [ConfigModule.forRoot({
        isGlobal:true,
        envFilePath:path.resolve("./config/.env"),
      }),
    auth_module,
  ],
    controllers: [AppController],
  providers: [AppService],
      

})
export class AppModule {}
