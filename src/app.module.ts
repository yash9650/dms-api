import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { createConnection } from 'mysql2/promise';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = config.get<number>('DB_PORT');
        const user = config.get<string>('DB_USER');
        const pass = config.get<string>('DB_PASS');
        const db = config.get<string>('DB_NAME');

        const conn = await createConnection({
          host,
          port,
          user,
          password: pass,
        });
        await conn.query(`CREATE DATABASE IF NOT EXISTS \`${db}\`;`);
        await conn.end();

        return {
          type: 'mysql',
          host,
          port,
          username: user,
          password: pass,
          database: db,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
