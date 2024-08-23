import { Injectable, NotFoundException } from '@nestjs/common';
//import { v4 as uuidv4 } from 'uuid';
//import { Task, TaskStatus } from './task.model';
//import { CreateTaskDto } from './dto/create-task.dto';
//import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
//import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
//import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    //@InjectRepository(TaskRepository) private taskRepository: TaskRepository,
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    console.log('FilterDto: ', filterDto);
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User) {
    const found = await this.taskRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task for the id ${id} was not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User) {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task for the id ${id} was not found`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  /* private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getFilteredTasks(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getTaskById(id: string) {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      return new NotFoundException(`Task for the id ${id} was not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.TODO,
    };

    console.log('New task created: ', task);
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    if (!(task instanceof NotFoundException)) {
      task.status = status;
    }
    return task;
  }

  deleteTask(id: string) {
    const found = this.getTaskById(id);
    console.log('deleted task: ', found);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  } */
}
