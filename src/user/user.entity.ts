import { Review } from 'src/review/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
      id: number;

  @Column('varchar')
      firstName: string;

  @Column('varchar')
      lastName: string;

  @Column({ type: 'varchar', unique: true })
      email: string;

  @Column({ type: 'boolean', default: false })
      isAdmin: boolean;

  @OneToMany(() => Review, (review) => review.user)
      reviews: Review[];
}
