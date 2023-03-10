import { IsString, Length, IsUrl, IsEmail } from 'class-validator';
import { PrimaryEntities } from 'src/utils/entities/primaryEntities';

export class UserPublicProfileResponse extends PrimaryEntities {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(0, 200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;
}
