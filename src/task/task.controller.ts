import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
//import { TaskStatus } from './task.model';
//import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ) {
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    return this.taskService.updateTaskStatus(id, status, user);
  }

  /*   @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
    if (Object.keys(filterDto).length) {
      return this.taskService.getFilteredTasks(filterDto);
    }
    return this.taskService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id) {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    console.log('Task: ', createTaskDto);

    return this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ) {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    this.taskService.deleteTask(id);
  } */
}
