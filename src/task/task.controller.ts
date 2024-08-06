import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id) {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    console.log('Task: ', createTaskDto);

    return this.taskService.createTask(createTaskDto);
  }

  @Patch("/:id/status")
  updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete("/:id")
  deleteTask(@Param('id') id: string) {
    this.taskService.deleteTask(id);
  }
}
