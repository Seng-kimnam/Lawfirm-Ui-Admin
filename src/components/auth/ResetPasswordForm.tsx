import { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";

import Button from "../ui/button/Button";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { resetPasswordService } from "@/Service/VerifyService";
// import { login } from "../../Service/UserService.tsx";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [isSending, setIsSending] = useState<boolean>(false);
  const navigate = useNavigate(); 
  type FormValues = {
    email: string;
    newPassword: string;
    confirmPassword: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const newPassword = watch("newPassword");

  const handleResetPassword: SubmitHandler<FormValues> = async (data) => {
    const email = localStorage.getItem("email") || "";
    const finalData: FormValues = { ...data, email };
    console.log("password ", finalData);
    if (!email || !data) {
      toast.error("Please enter your email!");
      return;
    }
    if (isSending) return;

    try {
      setIsSending(true);
      const res = await resetPasswordService(finalData);
      console.log("reset ", res);
      if (res.success) {
        toast.success(res.message);
        navigate("/signin");
        setTimeout(() => {
          setIsSending(false);
        }, 3000);
      } else {
        setIsSending(false);
      }
    } catch (error: any) {
      setIsSending(false);

      toast.error("Login failed.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset your password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below and check the hint while setting it.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(handleResetPassword)}>
              <div className="space-y-6">
                <div>
                  <Label>Set new password</Label>
                  <div className="relative">
                    <Input
                      className="py-6"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...register("newPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />

                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Confirm password</Label>
                  <div className="relative">
                    <Input
                      className="py-6"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                    />

                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}

                    {errors.newPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.newPassword.message}
                      </p>
                    )}

                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Confirm Password
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
