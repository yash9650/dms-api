import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { DocumentType } from '../types/document-type.enum';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ValidateIf((o) => o.type === DocumentType.FILE)
  @IsNotEmpty()
  @IsNumber()
  fileSize?: number;
}
