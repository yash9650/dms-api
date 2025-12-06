import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Like, Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { GetDocumentListDto } from './dto/get-document-list.dto';
import { TPagination } from './types/pagination.type';
import { DocumentType } from './types/document-type.enum';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
  ) {}

  private async buildCompletePath(parentId?: number): Promise<string> {
    if (!parentId) return '';
    const parent = await this.documentRepo.findOne({
      where: { id: parentId, type: DocumentType.FOLDER },
    });
    if (!parent)
      throw new NotFoundException(
        `Parent document with id ${parentId} not found`,
      );
    const parentPath = `${parent.completePath}/${parent.name}`;
    return parentPath;
  }

  private getCurrentPage(skip: number, limit: number): number {
    if (!limit || limit <= 0) return 1; // avoid divide-by-zero
    return Math.floor(skip / limit) + 1;
  }

  async create(dto: CreateDocumentDto): Promise<DocumentEntity> {
    const alreadyExist = await this.documentRepo.exists({
      where: {
        name: dto.name,
        parentId: dto.parentId,
        type: dto.type,
      },
    });

    if (alreadyExist) {
      throw new BadRequestException('Name already exist in current directory.');
    }
    const completePath = dto.parentId
      ? await this.buildCompletePath(dto.parentId)
      : '';
    const doc = this.documentRepo.create({
      ...dto,
      completePath,
    });
    return this.documentRepo.save(doc);
  }

  async list(dto: GetDocumentListDto): Promise<TPagination<DocumentEntity>> {
    const whereCondition: FindOptionsWhere<DocumentEntity> = {
      completePath: dto.search ? Like(`%${dto.search}%`) : undefined,
      parentId: dto.parentId === null ? IsNull() : dto.parentId,
    };

    const [documents, count] = await Promise.all([
      this.documentRepo.find({
        where: whereCondition,
        skip: dto.skip || 0,
        take: dto.limit || 10,
      }),
      this.documentRepo.count({
        where: whereCondition,
      }),
    ]);

    const paginatonData: TPagination<DocumentEntity> = {
      currentPage: this.getCurrentPage(dto.skip, dto.limit),
      totalPages: Math.ceil(count / dto.limit),
      data: documents,
    };

    return paginatonData;
  }
}
