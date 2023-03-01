import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { PrimaryEntities } from 'src/utils/entities/primaryEntities';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends PrimaryEntities {
  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @Length(2, 200)
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (Wish) => Wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (Offer) => Offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (Wishlist) => Wishlist)
  wishlists: Wishlist[];
}
