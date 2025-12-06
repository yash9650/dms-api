import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
