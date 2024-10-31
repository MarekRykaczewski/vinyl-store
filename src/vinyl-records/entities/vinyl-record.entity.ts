import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity('vinyl_records')
export class VinylRecord {
  @PrimaryGeneratedColumn()
      id: number;

  @Column('varchar')
      name: string;

  @Column('varchar')
      authorName: string;

  @Column('text')
      description: string;

  @Column('decimal')
      price: number;

  @Column('varchar')
      imageUrl: string;

  @CreateDateColumn()
      createdAt: Date;

  @OneToMany(() => Review, review => review.vinylRecord)
      reviews: Review[];
}
