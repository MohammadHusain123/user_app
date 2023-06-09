import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dto/login-dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EMAIL_NOT_FOUND, EMAIL_NOT_SEND, FORGOT_PASSWORD_SENT, INVALID_LOGIN_CREDENTIALS_MESSAGE, LINK_EXPIRE, MAIL_SUBJECT, USER_PASSWORD_UPDATED_MESSAGE } from 'src/utils/message';
import { LoginResponseDto } from './interfaces/login-response.dto';
import { jwtConstants } from './constraints/constant';
import { ResponseDto } from 'src/helpers/response.dto';
import * as jwt from 'jsonwebtoken';
import { EmailService } from 'src/helpers/emailServices';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordHash } from 'src/helpers/passwordHash';



@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  // user login method
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.getUserByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException(INVALID_LOGIN_CREDENTIALS_MESSAGE);
      }

      const passwordValidate = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordValidate) {
        throw new UnauthorizedException(INVALID_LOGIN_CREDENTIALS_MESSAGE);
      }

      const payload = { email: user.email, role: user.role };
      const accessToken: string = await this.jwtService.sign(payload);

      const { id, first_name, last_name, email, role } = user;

      return {
        accessToken,
        statusCode: 201,
        data: { id, first_name, last_name, email, role },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // forgot password method
  async forgotPassword(forgotPassword: ForgotPasswordDto, req): Promise<ResponseDto> {
    try {
      const user = await this.userService.getUserByEmail(forgotPassword.email);

      if (!user) {
        throw new NotFoundException(EMAIL_NOT_FOUND);
      }
      const userEmail = user.email;

      //  jwt token
      const token = jwt.sign(
        {
          user: user.id, email: userEmail
        },
        jwtConstants.secret,
        {},
      );

      const expireTime = new Date(Date.now() + 15 * 60 * 1000);
      await this.userService.setTokenAndDate(userEmail, token, expireTime);

      const resetPasswordLink = `${req.protocol}://${req.get('host')}/auth/password-reset/${token}`;
      const res = await EmailService.sendEmail(userEmail, MAIL_SUBJECT, resetPasswordLink);

      if (!res.response) {
        throw new BadRequestException(EMAIL_NOT_SEND);
      }
      return {
        statusCode: 201,
        message: FORGOT_PASSWORD_SENT,
      };
    } catch (error) {
      throw new HttpException(error.message, error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // reset password
  async resetPassword(token: string, userPassword): Promise<ResponseDto> {
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret) as {
        email: string;
      };

      const user = await this.userService.getUserByEmail(decodedToken.email);

      const { reset_password_token, reset_password_token_expire_time } = user;
      const { password } = userPassword;

      const time = new Date(Date.now());

      if (token == reset_password_token && reset_password_token_expire_time >= time) {
        // plain password to convert hash password
        const hashPassword = await PasswordHash.hash(password);
        // password change
        await this.userService.userPasswordUpdate(decodedToken.email, hashPassword);

        // remove user token and date
        const user = await this.userService.setTokenAndDate(decodedToken.email, null, null);
        console.log(user);

        return {
          statusCode: 201,
          message: USER_PASSWORD_UPDATED_MESSAGE,
        };
      }
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: LINK_EXPIRE,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
