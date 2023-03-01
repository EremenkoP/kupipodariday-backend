import { Length, IsNotEmpty, IsUrl } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { PrimaryEntities } from 'src/utils/entities/primaryEntities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends PrimaryEntities {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ scale: 2, default: 0 })
  price: number;

  @Column({ scale: 2, default: 0 })
  raised: number;

  @ManyToOne(() => User, (User) => User.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (Offer) => Offer.item)
  offers: Offer[];

  @Column()
  copied: number;
}
