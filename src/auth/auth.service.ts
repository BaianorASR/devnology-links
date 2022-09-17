import * as argon from 'argon2';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { PrismaService } from '../libs/prisma/prisma.service';
import { UserCreateDto } from './dtos/user-create.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async findMany(): Promise<User[]> {
    try {
      const users = this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async createAccount(dto: UserCreateDto): Promise<User> {
    try {
      const userToCreate = {
        ...dto,
        password: await argon.hash(dto.password),
      };

      const user = await this.prisma.user.create({
        data: userToCreate,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async userProfile(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          photo: true,
          _count: {
            select: { links: true },
          },
        },
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(emailOrName: string, password: string): Promise<any> {
    console.log({
      emailOrName,
      password,
    });

    try {
      const user = await this.prisma.user
        .findFirstOrThrow({
          where: {
            OR: [{ email: emailOrName }, { name: emailOrName }],
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        })
        .catch(() => {
          throw new NotFoundException('User not found');
        });

      const isPasswordValid = await argon.verify(user.password, password);
      if (!isPasswordValid) return null;

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Internal Server Error',
      );
    }
  }
}
