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
  delete: jest.fn(),
});

const mockUser = { id: 3, username: 'test_user' };

describe('TaskService', () => {
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
      expect(result).toMatchObject(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('successfully delete a task created by a user', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      await taskService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error if task can not be found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskService.deleteTask(2, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    describe('updateTaskStatus', () => {
      it('updating the task status', async () => {
        const mockTask = {
          title: 'Test task',
          description: 'Task description',
          status: TaskStatus.TODO,
          save: async () => {
            //console.log('save function called');
          },
        };
        taskRepository.findOne.mockResolvedValue(mockTask);
        const result = await taskService.updateTaskStatus(
          1,
          TaskStatus.IN_PROGRESS,
          mockUser,
        );
        expect(result.title).toBe('Test task');
      });

      it('updates task status', async () => {
        taskService.getTaskById = jest.fn().mockResolvedValue({
          status: TaskStatus.TODO,
          save: jest.fn().mockResolvedValue(true),
        });

        const result = await taskService.updateTaskStatus(
          1,
          TaskStatus.DONE,
          mockUser,
        );
        expect(result.status).toBe(TaskStatus.DONE);
      });
    });
  });
});
