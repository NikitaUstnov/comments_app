import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/api/user/entities/user.entity';
import { File } from 'src/services/database/common-entities/file.entity';
import { Post } from 'src/api/post/entities/post.entity';
import { Comment } from 'src/api/comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, File, Post, Comment],
        synchronize: configService.get('MODE') === 'development',
        logging: configService.get('MODE') === 'development',
        ssl:
          configService.get('MODE') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
