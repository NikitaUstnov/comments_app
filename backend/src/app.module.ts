import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.MODE}`],
      ignoreEnvFile: false,
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
