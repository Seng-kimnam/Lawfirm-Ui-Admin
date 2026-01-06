import { ClientInterface } from "./Client";
import { CourtInterface, CourtTypeInterface } from "./Court";

export interface CaseInterface {
  caseId: number;
  client: ClientInterface;
  court: CourtInterface;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStatus {
  value: string;
  label: string;
}

export interface CaseRequest {
  clientId: number;
  courtId: number;
  title: string;
  description: string;
  status: string;
  startedDate: string;
  endedDate: string;
}
