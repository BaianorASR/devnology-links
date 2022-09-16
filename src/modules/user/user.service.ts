import { PrismaService } from 'src/libs/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return this.prisma.user.findMany();
  }
}
