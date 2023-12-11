import { Injectable, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { isArray, isURL } from 'class-validator';
import { nanoid } from 'nanoid';
import { checkIfFileOrDirectoryExists, createFile, getFile, validUrl } from 'src/helpers/storage.helper';

@Injectable()
export class UrlShortenerService {
  async create(url: CreateUrlShortenerDto, req: any) {
    const filePath = `src/database`;
    const fileName = 'url';

    if (!isURL(url.longUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }
    const baseUrl = url.longUrl.substring(0, url.longUrl.indexOf('/', 8));
    const urlPath = url.longUrl.substring(baseUrl.length + 1);
    const urlCode = nanoid(10);
    const newUrls = { longUrl: url.longUrl, shortUrl: `${baseUrl}/${urlCode}` }

    try {
      let data = [];
      if (checkIfFileOrDirectoryExists(`${filePath}/${fileName}`)) {
        const fileData = JSON.parse((await getFile(`${filePath}/${fileName}`)).toString());
        //data.push(fileData);
        isArray(fileData) ? data = fileData : data.push(fileData);
      } else {
        data = [];
      }
      if (data.length > 0) {
        let urlCollection:any;
        urlCollection = data?.filter((x: any) => x.userID === req.user.userID);
        if (urlCollection.length > 0) {
          urlCollection[0].urls.push(newUrls);
        } else {
          const newUser = { userID: req.user.userID, urls: [newUrls] };
          data.push(newUser);
        }
      } else {
        const newUser = { userID: req.user.userID, urls: [newUrls] };
        data.push(newUser);
      }
      const csv = JSON.stringify(data);
      await createFile(filePath, fileName, csv);
      return {status:'success',newUrls: newUrls};
    } catch (error) {
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async findAll(req: any) {
    const filePath = `src/database`;
    const fileName = 'url';
    try {
      if (checkIfFileOrDirectoryExists(`${filePath}/${fileName}`)) {
        let data = [];
        const fileData = JSON.parse((await getFile(`${filePath}/${fileName}`)).toString());
        isArray(fileData) ? data = fileData : data.push(fileData);
        const result = data?.filter((x: any) => x.userID === req.user.userID);
        return { status: 'success', urls: result[0]?.urls ?? []};
      } else {
        return { status: 'success', urls: [] };
      }
    } catch (error) {
      throw new UnprocessableEntityException('Server Error');
    }
  }

}
