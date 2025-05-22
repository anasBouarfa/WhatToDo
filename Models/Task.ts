export type TaskOccurrence = 'once' | 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'yearly';

export class Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
  occurrence: TaskOccurrence;

  constructor(title: string, description: string, date: Date, occurrence: TaskOccurrence = 'once') {
    this.id = Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.description = description;
    this.date = date;
    this.completed = false;
    this.occurrence = occurrence;
  }
} 