import { User } from 'src/users/entities/user.entity';
import { PrimaryEntities } from 'src/utils/entities/primaryEntities';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends PrimaryEntities {
  @ManyToOne(() => User, (User) => User.offers)
  user: User;

  @ManyToOne(() => Wish, (Wish) => Wish.offers)
  item: Wish;

  @Column({ scale: 2, default: 0 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
