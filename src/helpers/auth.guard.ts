import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
const jwt = require('jsonwebtoken')

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new HttpException('Missing authorization header', HttpStatus.UNAUTHORIZED);
    }

    const token = authorizationHeader.split('Bearer ')[1]; // Extract token from header

    try {
      const decodedToken = jwt.verify(token,'hbfshfbskhfbkfbskfb'); 
      request.user = decodedToken; 
      //request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }
}
