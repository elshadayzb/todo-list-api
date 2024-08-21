import {
  Body,
  Controller,
  Post,
  //Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user) {
    console.log('user: ', user);
  }
}
