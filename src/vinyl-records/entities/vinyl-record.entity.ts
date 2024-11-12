import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';

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

  @OneToMany(() => Review, (review) => review.vinylRecord, {
      cascade: true,
      onDelete: 'CASCADE',
  })
      reviews: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.vinylRecord)
      purchases: Purchase[];
}
