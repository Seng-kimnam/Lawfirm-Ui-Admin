import { CaseInterface } from "./Case";
import { Lawyer, Lawyers } from "./Lawyer";

export interface TaskInterface {
  taskId: number;
  lawyer: Lawyer;
  legalCase: CaseInterface;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  priority: string;
}

export interface TaskStatus {
  value: string;
  label: string;
}

export interface TaskPriority {
  value: string;
  label: string;
}

export interface TaskRequest {
  caseId: number;
  lawyerId: number;
  title: string;
  description: string;
  status: string;
  taskPriority: string;
  startedDate: string;
  dueDate: string;
}

export interface TaskStatus {
  value: string;
  label: string;
}

export interface TaskPriority {
  value: string;
  label: string;
}
