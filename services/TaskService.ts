import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../Models/Task';

const TASKS_STORAGE_KEY = '@tasks';

export class TaskService {
  private static instance: TaskService;
  private tasks: Task[] = [];

  private constructor() {}

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async loadTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (tasksJson) {
        const tasksData = JSON.parse(tasksJson);
        this.tasks = tasksData.map((task: any) => {
          const taskObj = new Task(
            task.title,
            task.description,
            new Date(task.date),
            task.occurrence
          );
          taskObj.id = task.id;
          taskObj.completed = task.completed;
          return taskObj;
        });
      }
      return this.tasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  async saveTasks(): Promise<void> {
    try {
      const tasksJson = JSON.stringify(this.tasks);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, tasksJson);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  async createTask(task: Task): Promise<Task> {
    this.tasks.push(task);
    await this.saveTasks();
    return task;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    await this.saveTasks();
    return this.tasks[taskIndex];
  }

  async deleteTask(taskId: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    if (this.tasks.length !== initialLength) {
      await this.saveTasks();
      return true;
    }
    return false;
  }

  private isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  }

  async getTasksForWeek(startDate: Date): Promise<Task[]> {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return this.tasks.filter(task => {
      const taskDate = new Date(task.date);
      
      // Handle different occurrence types
      switch (task.occurrence) {
        case 'once':
          return taskDate >= startDate && taskDate <= endDate;
        
        case 'daily':
          return true; // Show all daily tasks
        
        case 'weekdays':
          // Show weekday tasks only on weekdays
          return this.isWeekday(taskDate);
        
        case 'weekly':
          // Show weekly tasks on the same day of the week
          return taskDate.getDay() === startDate.getDay();
        
        case 'monthly':
          // Show monthly tasks on the same day of the month
          return taskDate.getDate() === startDate.getDate();
        
        case 'yearly':
          // Show yearly tasks on the same day of the year
          return taskDate.getMonth() === startDate.getMonth() && 
                 taskDate.getDate() === startDate.getDate();
        
        default:
          return false;
      }
    });
  }
} 