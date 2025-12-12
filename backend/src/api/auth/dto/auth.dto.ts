import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class TokenDto {
  @IsJWT()
  token: string;
}
