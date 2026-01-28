"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { verifyResetPasswordService } from "@/Service/VerifyService";

type DataVerify = {
  email: string;
  otp: string;
};

export function OtpForm() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DataVerify>({
    defaultValues: {
      otp: "",
      email: "", // you can also pre-fill from location/state
    },
  });

  const handleVerifyOTP: SubmitHandler<DataVerify> = async (data) => {
    if (!data.otp || data.otp.length !== 6) {
      toast.error("Please enter a valid OTP");
      return;
    }
    const email: string = localStorage.getItem("email") ?? "";
    const finalData: DataVerify = { ...data, email };

    if (isSending) return;

    try {
      setIsSending(true);

      const res = await verifyResetPasswordService(finalData);

      if (res.success) {
        toast.success(res.message);
        navigate("/reset-password");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Verification failed.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold  text-title-sm">Verify OTP</h1>
          <p className="text-sm text-gray-400">
            Enter the OTP sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-4">
          {/* OTP */}
          <Controller
            name="otp"
            control={control}
            rules={{ required: true, maxLength: 6 }}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {errors.otp && (
            <p className="text-sm text-red-500 text-center">
              OTP must be 6 digits
            </p>
          )}

          <Button
            className="w-full text-[16px]"
            size="sm"
            type="submit"
            disabled={isSending}
          >
            {isSending ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
}
