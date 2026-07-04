import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT||5000;
  // console.log(process.env.PORT);
  
  const app = await NestFactory.create(AppModule);

  await app.listen(port,()=>{});

  console.log(`SERVER RUNNING ${port}`);
}

bootstrap();