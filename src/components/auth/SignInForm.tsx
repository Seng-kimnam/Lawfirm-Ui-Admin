import { useState } from "react";
import { Link, useNavigate, } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { request } from "../../constants/api";
import { loginUrl } from "../../constants/constants_url";
// import { login } from "../../Service/UserService.tsx";

export default function SignInForm() {
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
    alert("Please enter email and password!");
    return;
  }

  try {
    const res = await request(loginUrl, "post", data);

    if (res?.success) {
      const payload = res.payload;

      localStorage.setItem("token", payload.token);
      navigate("/");
    }

  } catch (error) {
    alert("Login failed");
  }
};


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
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
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
