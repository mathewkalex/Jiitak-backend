import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, loginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkIfFileOrDirectoryExists, createFile, getFile } from 'src/helpers/storage.helper';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt'
const jwt = require('jsonwebtoken')

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const filePath = `src/database`;
    const fileName = 'user';
    let data;

    if (checkIfFileOrDirectoryExists(`${filePath}/${fileName}`)) {
      data = JSON.parse((await getFile(`${filePath}/${fileName}`)).toString());
    } else {
      data = [];
    }
    if(data.length > 0 ){
      if(data?.map((x:CreateUserDto) => x.userName == createUserDto.userName)[0]) {
        throw new NotFoundException('username already exist');
      }
    }
    createUserDto.userID = uuidv4();
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    data.push(createUserDto);
    const csv = JSON.stringify(data);
    await createFile(filePath, fileName, csv);
    const token = this.getToken(createUserDto);
    return { status:'success', token:token};
  }

  async login(loginDto: loginDto): Promise<any> {
    const filePath = `src/database`;
    const fileName = 'user';
    let data: any;
    if (checkIfFileOrDirectoryExists(`${filePath}/${fileName}`)) {
      data = JSON.parse((await getFile(`${filePath}/${fileName}`)).toString());
      const user = await Promise.all(data?.map(async (x: CreateUserDto) => {
        if (x.userName === loginDto.userName) {
          if (await bcrypt.compare(loginDto.password, x.password)) {
            return x;
          }
        }
        return null;
      }));
      const validUsers = user.filter((user) => user !== null);
      if (validUsers.length > 0) {
        const token = this.getToken(validUsers[0]);
        return { status:'success',token: token };
      } else {
        throw new NotFoundException('Users not found');
      }
    } else {
      throw new NotFoundException('Users export not found.');
    }
  }

  getToken(user: CreateUserDto) {
    const token = jwt.sign(user, 'hbfshfbskhfbkfbskfb');
    return token;
  }

}
