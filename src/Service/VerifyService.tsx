import { request } from "@/constants/api";

export const resendOTPService = async (email: string) => {
  try {
    const res = await request(`verifications/resend?email=${email}`, "POST");
    if (res.success) {
      return res;
    }
  } catch (err: any) {
    console.error(err);
  }
};
