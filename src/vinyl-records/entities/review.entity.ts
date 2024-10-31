import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { VinylRecord } from './vinyl-record.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
      id: number;

  @Column('text')
      content: string;

  @Column('float')
      score: number;

  @CreateDateColumn()
      createdAt: Date;

  @ManyToOne(() => VinylRecord, vinylRecord => vinylRecord.reviews)
      vinylRecord: VinylRecord;
}
