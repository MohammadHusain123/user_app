import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResponseDto } from 'src/helpers/response.dto';
import { EMAIL_EXITS, USER_CREATED, USER_DELETED, USER_FETCHED, USER_NOT_FOUND, USER_UPDATED } from 'src/utils/message';
import { PasswordHash } from 'src/helpers/passwordHash';
import { PaginationDto } from './dto/pagination-dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>) { }

  // create user
  async create(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const { first_name, last_name, email, password } = createUserDto;

      // check email is exits or not
      const isEmailExit = await this.isEmailExits(email);

      if (isEmailExit != 0) {
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: EMAIL_EXITS,
        }
      }

      // plain password to convert hash password
      const hashPassword = await PasswordHash.hash(password);

      const user = await this.usersRepository.save({ first_name, last_name, email, password: hashPassword });
      user.password = undefined;
      user.reset_password_token = undefined;
      user.reset_password_token_expire_time = undefined;
      user.is_active = undefined;

      return {
        statusCode: 201,
        message: USER_CREATED,
        data: user
      }

    } catch (error) {
      throw new HttpException(error.message, error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // email id is exits or not method
  async isEmailExits(email: string): Promise<number> {
    try {
      const count = await this.usersRepository.count({ where: { email } });
      return count;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // find one by email id
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // find all user with pagiation and search
  async findAll(queryData: PaginationDto): Promise<ResponseDto> {
    try {

      const { page, limit, rawQuery } = queryData;
      const skip = (page - 1) * limit || 0;
      const take = limit || 10;

      const query = await this.usersRepository.createQueryBuilder('user')
        .select(['user.id', 'user.first_name', 'user.last_name', 'user.email', 'created_at', 'updated_at'])
        .skip(skip).take(take)

      if (rawQuery) {
        await query.where("(user.first_name like :fname OR user.last_name like :lname)", {
          fname: `%${rawQuery}%`,
          lname: `%${rawQuery}%`,
        });
      }

      const user = await query.getManyAndCount();

      return {
        statusCode: 200,
        message: USER_FETCHED,
        data: user
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // update uset=r method
  async update(id: number, updateUser: UpdateUserDto): Promise<ResponseDto> {
    try {

      const userExits = await this.usersRepository.count({ where: { id } });
      if (userExits == 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }

      // convert password to hash
      const hashPassword = await PasswordHash.hash(updateUser.password);

      const user = new User();
      user.first_name = updateUser.first_name;
      user.last_name = updateUser.last_name;
      user.email = updateUser.email;
      user.password = hashPassword;

      await this.usersRepository.update(id, user);
      return {
        statusCode: 204,
        message: USER_UPDATED
      }

    } catch (error) {
      throw new HttpException(error.message, error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // delete user method
  async remove(id: number): Promise<ResponseDto> {
    try {
      const userExits = await this.usersRepository.count({ where: { id } });
      if (userExits == 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }

      await this.usersRepository.delete({ id });
      return {
        statusCode: 204,
        message: USER_DELETED
      }
    } catch (error) {
      throw new HttpException(error.message, error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // reset password token and expire time save
  async setTokenAndDate(email, token: string, expireTime: Date): Promise<void> {
    try {
      const user = new User();
      user.reset_password_token = token;
      user.reset_password_token_expire_time = expireTime;

      await this.usersRepository
        .createQueryBuilder()
        .update()
        .set(user)
        .where({ email })
        .execute();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update password user
  async userPasswordUpdate(email: string, password: string): Promise<boolean> {
    try {
      const user = new User();
      user.password = password;
      const result = await this.usersRepository
        .createQueryBuilder()
        .update(user)
        .set({ password })
        .where({ email })
        .execute();
      if (!result) {
        return false;
      }
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
