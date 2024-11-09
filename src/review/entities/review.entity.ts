import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { VinylRecord } from '../../vinyl-records/entities/vinyl-record.entity';
import { User } from 'src/user/user.entity';

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

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
      user: User;

  @ManyToOne(() => VinylRecord, (vinylRecord) => vinylRecord.reviews)
  @JoinColumn({ name: 'vinylRecordId' })
      vinylRecord: VinylRecord;

  @Column({ type: 'int', name: 'vinylRecordId' })
      vinylRecordId: number;
}
