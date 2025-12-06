import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class GetDocumentListDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(0)
  skip: number;

  @IsNumber()
  @Min(10)
  limit: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
