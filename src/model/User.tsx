import { Roles } from "./Roles";
import { ServiceType } from "./ServiceType";

export interface User {
  email: string;
  password: string;
}


export interface CurrentUserProfile {
  fullName: string;
  gender: string;
  lawyerStatus: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  expertises: string[];
  image?: string;
  description: string;
  title?: string;
  facebookLink?: string;
  tiktokLink?: string;
  telegramLink?: string;
  createdAt: string;
  updatedAt: string;
}
// export interface 