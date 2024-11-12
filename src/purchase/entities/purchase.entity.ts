import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
      id: number;

  @ManyToOne(() => User, (user) => user.purchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
      user: User;

  @ManyToOne(() => VinylRecord, (vinylRecord) => vinylRecord.purchases)
  @JoinColumn({ name: 'vinylRecordId' })
      vinylRecord: VinylRecord;

  @Column({ type: 'int', name: 'vinylRecordId' })
      vinylRecordId: number;

  @CreateDateColumn()
      createdAt: Date;
}
