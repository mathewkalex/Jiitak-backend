import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly firstName: string

    @IsString()
    @IsOptional()
    readonly lastName: string

    @IsString()
    @IsNotEmpty()
    readonly userName: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    userID: string
}

export class loginDto {
    @IsString()
    @IsNotEmpty()
    readonly userName: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
