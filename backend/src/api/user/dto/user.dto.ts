import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password_hash?: string;

  @IsBoolean()
  @IsOptional()
  is_guest?: boolean;

  @IsString()
  @IsOptional()
  session_token?: string;

  @IsString()
  @IsOptional()
  session_expires_at?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
