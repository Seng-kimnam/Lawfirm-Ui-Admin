import { useState } from "react";

import Label from "../form/Label";

import Button from "../ui/button/Button";

import toast from "react-hot-toast";
import { resendOTPService } from "@/Service/VerifyService";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Input } from "../ui/input";
import { ArrowLeft } from "iconsax-reactjs";
// import { login } from "../../Service/UserService.tsx";

export default function ForgetPasswordForm() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    // formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();
  type FormValues = {
    email: string;
  };

  function handleNavToSignin() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/signin");
    }, 2000);
  }
  const handleSendOTP: SubmitHandler<FormValues> = async (data) => {
    const { email } = data;
    localStorage.setItem("email", email);
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
    if (isSending) return;

    try {
      setIsSending(true);
      const res = await resendOTPService(email);

      if (res.success) {
        toast.success(res.message);
        navigate("/otp-form");
        setTimeout(() => {
          setIsSending(false);
        }, 3000);
      } else {
        setIsSending(false);
      }
    } catch (error: any) {
      setIsSending(false);

      toast.error("Failed to sending otp.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center flex-1">
      {!isLoading ? (
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <button
            onClick={handleNavToSignin}
            className="text-lg text-brand-50 my-6   flex items-center text-left hover:text-brand-600 dark:text-gray-400"
          >
            <ArrowLeft size="24" color="#d9e3f0" /> Back
          </button>
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Forget Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and we'll send you otp code.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit(handleSendOTP)}>
                <div className="space-y-6">
                  <div>
                    <Label className="text-xl">Email</Label>
                    <Input
                      className="py-6"
                      placeholder="info@gmail.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>

                  <div>
                    <Button
                      className="w-full text-[16px]"
                      size="sm"
                      type="submit"
                    >
                      {isSending ? "Sending OTP..." : "Send code"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <span className="mx-auto m-0 loader"></span>
      )}
    </div>
  );
}
