import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
//import path from 'path';
import { Task } from '../task/task.entity';
import * as config from 'config';

const dbConfig: any = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type, //'postgres',
  host: dbConfig.host, //'localhost',
  port: dbConfig.port, //5432,
  username: dbConfig.username, //'postgres',
  password: dbConfig.password, //'1234',
  database: dbConfig.database, //'taskmanagement',
  //entities: [path.join(__dirname, '/../**/*.entity.ts')],
  entities: [Task, User],
  synchronize: dbConfig.synchronize, //true,
  migrations: [],
};
