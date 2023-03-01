import { IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { PrimaryEntities } from 'src/utils/entities/primaryEntities';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export class Wishlist extends PrimaryEntities {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
