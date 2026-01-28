import { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

import Button from "../ui/button/Button";
import { request } from "../../constants/api";
import { loginUrl } from "../../constants/constants_url";
import toast from "react-hot-toast";
// import { login } from "../../Service/UserService.tsx";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const value = { email, password };
  // const btnSign = async (email: string, password: string) => {
  //   const data = {
  //         email: email,
  //         password: password,
  //     }
  //     if (!email || !password) {
  //         alert("Please enter email and password!");
  //         return;
  //     }
  //     try {
  //         const res = await request("auth/login","post" ,data);
  //         if (res){
  //             localStorage.setItem('token', res.access_token);
  //             if (res.user){
  //                 localStorage.setItem('id',res.user.id);
  //                 localStorage.setItem('user_name',res.user.user_name);
  //                 localStorage.setItem('email',res.user.email);
  //                 if (res.user.staff){
  //                     localStorage.setItem('image',res.user.staff.image);
  //                     localStorage.setItem('phone',res.user.staff.phone);
  //                 }
  //             }
  //             navigate("/");
  //         }
  //         console.log(res);
  //     } catch (error) {
  //         console.error("Login error:", error);
  //         alert("Something went wrong, please try again later.");
  //     }
  // };
  const btnSign = async () => {
    const data = { email, password };

    if (!email || !password) {
      toast.error("Please enter email and password!");
      return;
    }

    try {
      const res = await request(loginUrl, "POST", data);

      if (res?.success) {
        const { payload } = res;
        const { roleName } = payload.currentUser.role;
        // console.log("rol ", roleName);
        localStorage.setItem("token", payload.token);
        localStorage.setItem("role", roleName);

        navigate("/");
        toast.success("Login successfully! Welcome to GClaw firm system.");
      }
    } catch (error: any) {
      toast.error("Login fail.", error);
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                btnSign();
              }}
            >
              <div className="space-y-6">
                <div>
                  <Label>Set new password</Label>
                  <Input
                    placeholder="Enter new password"
                    type={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Confirm password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your confirm password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
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
