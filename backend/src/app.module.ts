import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { PostModule } from './api/post/post.module';
import { CommentModule } from './api/comment/comment.module';
import { AuthModule } from './api/auth/auth.module';
import { DatabaseModule } from './services/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.MODE}`],
      ignoreEnvFile: false,
      expandVariables: true,
    }),
    UserModule,
    PostModule,
    CommentModule,
    AuthModule,
  ],
})
export class AppModule {}
