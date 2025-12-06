import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentType } from './types/document-type.enum';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column()
  name: string;

  @Column({ default: '' })
  completePath: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => DocumentEntity)
  @JoinColumn({ name: 'parentId' })
  parent?: DocumentEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
