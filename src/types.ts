export interface ChecklistItem {
  status: number;
  isAllDay: boolean;
  startDate: string;
  title: string;
  id: string;
  sortOrder: number;
}
export enum TaskKind {
  Text = "TEXT",
  Checklist = "CHECKLIST",
  Note = "NOTE",
}

export interface Task {
  id: string;
  title: string;
  priority: 0 | 1 | 3 | 5 | undefined;
  projectId: string;
  content?: string;
  desc?: string;
  items?: ChecklistItem[];
  kind?: TaskKind;
  tags: string[];
  startDate?: string;
  dueDate?: string;
  isAllDay: boolean;
  isFloating: boolean;
  timeZone: string;
}

export interface Section {
  id: string;
  name: string;
  children: Task[];
}

export interface Project {
  id: string;
  name: string;
}
