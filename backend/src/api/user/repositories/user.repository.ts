import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly userRepository: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async create(createUserDto: UpdateUserDto): Promise<User | null> {
    return await this.userRepository.save(createUserDto);
  }

  async removeById(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }
}
