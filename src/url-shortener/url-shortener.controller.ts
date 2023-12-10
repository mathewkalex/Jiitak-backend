import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { JwtAuthGuard } from 'src/helpers/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  create(@Body() createUrlShortenerDto: CreateUrlShortenerDto,@Req() req: Request) {
    return this.urlShortenerService.create(createUrlShortenerDto,req);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.urlShortenerService.findAll(req);
  }

}
