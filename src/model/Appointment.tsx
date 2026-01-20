import { CaseInterface } from "./Case";
import { TaskInterface } from "./Task";

export interface AppointmentInterface {
  appointmentId: number;
  task: TaskInterface;
  appointmentDate: string;
  appointmentTime: string;
  meetingType: string;
  location: string;
  purpose: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


export interface AppointmentFormData {
  taskId: number;
  purpose: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingType: "IN_PERSON" | "ONLINE";
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}