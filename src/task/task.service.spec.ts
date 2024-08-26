import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

const mockUser = { id: 3, username: 'test_user' };

describe('Task Service', () => {
  let taskService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = await module.get<TaskService>(TaskService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the respository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('test task');
      const filterDto: GetTasksFilterDto = {
        search: 'task',
        status: TaskStatus.IN_PROGRESS,
      };

      const result = await taskService.getTasks(filterDto, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('test task');
    });
  });

  describe('getTaskById', () => {
    it('successfully retrieve task by id', async () => {
      const mockTask = { title: 'Test task', description: 'Task description' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      await taskService.getTaskById(2, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2, userId: mockUser.id },
      });
    });

    it('throws an error if task can not be found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById(2, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('test the creation of new task', async () => {
      const mockTask = { title: 'Test Task', description: 'Task description' };
      taskRepository.createTask.mockResolvedValue(mockTask);
      const result = await taskService.createTask(mockTask, mockUser);
      expect(result).toEqual(mockTask);
    });
  });
});
