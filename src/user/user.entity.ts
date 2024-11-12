import { Review } from 'src/review/entities/review.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
      id: number;

  @Column('varchar')
      firstName: string;

  @Column('varchar')
      lastName: string;

  @Column({ type: 'varchar', nullable: true })
      avatarUrl: string | null;

  @Column({ type: 'date', nullable: true })
      birthdate: Date | null;

  @Column({ type: 'varchar', unique: true })
      email: string;

  @Column({ type: 'boolean', default: false })
      isAdmin: boolean;

  @OneToMany(() => Review, (review) => review.user)
      reviews: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.user, { cascade: true })
      purchases: Purchase[];
}
