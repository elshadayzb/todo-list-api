import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
//import path from 'path';
import { Task } from 'src/task/task.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'taskmanagement',
  //entities: [path.join(__dirname, '/../**/*.entity.ts')],
  entities: [Task, User],
  synchronize: true,
};
