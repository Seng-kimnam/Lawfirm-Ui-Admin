"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "../ui/button/Button";

import { useNavigate } from "react-router";

export function OtpForm() {
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify OTP
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and we'll send you otp code.
            </p>
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // btnSign();
              }}
            >
              <div className="space-y-2">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={(value) => setValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <div className="text-center text-sm">
                  {value === "" ? (
                    <>Enter your one-time password.</>
                  ) : (
                    <>You entered: {value}</>
                  )}
                </div>
                <div>
                  <Button
                    onClick={() => navigate("/reset-password-form")}
                    className="w-full text-[16px]"
                    size="sm"
                    type="submit"
                  >
                    Send code
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
