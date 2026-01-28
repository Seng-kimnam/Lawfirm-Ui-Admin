import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { request } from "../../constants/api";
import { loginUrl } from "../../constants/constants_url";
import toast from "react-hot-toast";
// import { login } from "../../Service/UserService.tsx";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

  function handleNavToForgetPassword() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/forget-password");
    }, 3000);
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {!isLoading ? (
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
                    <Label>Email</Label>
                    <Input
                      placeholder="info@gmail.com"
                      type={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
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
                    <button
                      onClick={handleNavToForgetPassword}
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div>
                    <Button className="w-full" size="sm" type="submit">
                      Sign in
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <span className="mx-auto m-0 loader"></span>
        )}
      </div>
    </div>
  );
}
