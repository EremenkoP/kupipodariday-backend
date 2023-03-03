import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByName(username);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const passIsMatch = await bcrypt.compare(password, user.password);
    if (user && passIsMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = user;
      return res;
    }
    return null;
  }

  login(user: User): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY || 'secretkey',
        expiresIn: '7d',
      }),
    };
  }
}
