import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';

@Module({
  imports: [UsersModule, UrlShortenerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
