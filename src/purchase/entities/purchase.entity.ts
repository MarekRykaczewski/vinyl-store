import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { VinylRecord } from 'src/vinyl-records/entities/vinyl-record.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
      id: number;

  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: 'userId' })
      user: User;

  @ManyToOne(() => VinylRecord, (vinylRecord) => vinylRecord.purchases)
  @JoinColumn({ name: 'vinylRecordId' })
      vinylRecord: VinylRecord;

  @CreateDateColumn()
      createdAt: Date;
}