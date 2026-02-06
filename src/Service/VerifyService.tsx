import { request } from "@/constants/api";

type DataVerify = {
  email: string;
  otp: string;
};
type DataForReset = {
  email: string;
  newPassword: string;
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

export const resetPasswordService = async (data: DataForReset) => {
  try {
    if (!data) return;
    const { email, newPassword } = data;

    const res = await request(
      `auths/reset-password?email=${email}&newPassword=${newPassword}`,
      "PUT",
    );
    if (res.success) {
      return res;
    }
  } catch (err: any) {
    console.error(err);
  }
};
