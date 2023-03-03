import { PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserPublicProfileResponse extends PartialType(User) {}
