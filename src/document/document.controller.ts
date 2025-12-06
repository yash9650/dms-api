import { Body, Controller, Post } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentService } from './document.service';
import { GetDocumentListDto } from './dto/get-document-list.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('create')
  create(@Body() dto: CreateDocumentDto) {
    return this.documentService.create(dto);
  }

  @Post('list')
  async list(@Body() dto: GetDocumentListDto) {
    return this.documentService.list(dto);
  }
}
