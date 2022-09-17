/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserCreateDto } from './dtos/user-create.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('users')
export class UserController {
  constructor(private readonly AuthService: AuthService) {}

  @Get()
  async findMany(): Promise<User[]> {
    return await this.AuthService.findMany();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async userProfile(@CurrentUser() currentUser: User): Promise<User> {
    return await this.AuthService.userProfile(currentUser.id);
  }

  @Post()
  async createAccount(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: UserCreateDto,
  ) {
    await this.AuthService.createAccount(dto);

    res.status(HttpStatus.OK).json({ token: 'token' });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    return await this.AuthService.login(req.user);
  }
}
