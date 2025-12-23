import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'generated/prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { UserRolesGuard } from './guards/user-roles/user-roles.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {

    console.log({ request });

    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      rawHeaders
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRolesGuard)
  PrivateRoute2(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.user)
  @UseGuards(AuthGuard(), UserRolesGuard)
  PrivateRoute3(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user,
    };
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // login(@Req() req) {
  //   return req.user;
  // }

}
