import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cats/cats.module';
import { PedigreeModule } from './pedigree/pedigree.module';
import { BreedsModule } from './breeds/breeds.module';
import { CoatColorsModule } from './coat-colors/coat-colors.module';
import { BreedingModule } from './breeding/breeding.module';
import { CareModule } from './care/care.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
import { CacheModule as CustomCacheModule } from './common/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 60 * 1000, // 5 minutes default TTL
      max: 100, // maximum number of items in cache
    }),
    CustomCacheModule, // 新しいカスタムキャッシュモジュール
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CatsModule,
    PedigreeModule,
    BreedsModule,
    CoatColorsModule,
    BreedingModule,
    CareModule,
    ScheduleModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
