import { request } from "@/constants/api";

type DataVerify = {
  email: string;
  otp: string;
};
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

export const verifyResetPasswordService = async (data: DataVerify) => {
  try {
    if (!data) return;
    const { email, otp } = data;

    const res = await request(
      `verifications/verify-reset-password?email=${email}&otp=${otp}`,
      "PUT",
    );
    if (res.success) {
      return res;
    }
  } catch (err: any) {
    console.error(err);
  }
};
