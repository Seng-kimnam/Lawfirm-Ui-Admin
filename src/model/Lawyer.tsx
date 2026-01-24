export interface Lawyer {
  appUserId: number; //1
  fullName: string;
  name: string;
  username: string; //6
  password: string;
  gender: string; //2
  image: string;
  title: string;
  description: string; //8
  role?: {
    createdAt: string;
    updatedAt: string;
    roleId: number;
    roleName: string; // "ROLE_LAWYER"//7
  };
  expertises: string[];
  email: string; //4
  phoneNumber: string; //5
  facebookLink: string;
  tiktokLink: string;
  telegramLink: string;

  createdAt: Date;
  updatedAt: Date;
  lawyerStatus: string; //3
  enabled: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}
export interface Lawyers {
  appUserId: number; //1
  fullName: string; //2
  gender: string; //3
  lawyerStatus: "ACTIVE" | "INACTIVE"; //
  email: string; //7
  phoneNumber: string; //8
  password: string; //9
  roleId: number; //4

  expertiseIdList: number[]; //5
  image: File | string | null; //9
  description: string; //10
  title: string; //6
  facebookLink?: string; ///
  tiktokLink?: string;
  telegramLink?: string;
  fileUpload: File | null;
  fileUrl: File | null;
}
export interface multiOptionsEx {
  value: string;
  text: string;
  selected: boolean;
}

export interface LawyerProfileRequest {
  fullName: string;
  gender: string;
  lawyerStatus: string | "ACTIVE" | "INACTIVE";
  email: string;
  phoneNumber: string;
  password: string;
  roleId: number | "ROLE_LAWYER";
  expertiseIdList: number[];
  image: string;
  description: string;
  title: string;
  facebookLink: string;
  tiktokLink: string;
  telegramLink: string;
}
