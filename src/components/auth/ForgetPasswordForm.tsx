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

export default function ForgetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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
      console.log("res ", res);
      if (res?.success) {
        const { payload } = res;
        const { roleName } = payload.currentUser.role;
        // console.log("rol ", roleName);
        localStorage.setItem("token", payload.token);
        localStorage.setItem("role", roleName);
        const role = localStorage.getItem("role");

        console.log("r", role);
        navigate("/");
        toast.success("Login successfully! Welcome to GClaw firm system.");
      }
    } catch (error: any) {
      toast.error("Login fail.", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                btnSign();
              }}
            >
              <div className="space-y-6">
                <div>
                  <Label className="text-xl">Email</Label>
                  <Input
                    placeholder="info@gmail.com"
                    type={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Button
                    onClick={() => navigate("/otp-form")}
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
