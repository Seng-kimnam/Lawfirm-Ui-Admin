import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Label from "./form/Label";
import { request } from "@/constants/api";
import { LawyerProfileRequest } from "@/model/Lawyer";
import toast from "react-hot-toast";
import { updateProfileService } from "@/Service/UserService";
import { GetExpertiseList } from "@/Service/ServiceTypeService";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { CurrentUserProfile } from "@/model/User";
import { getRoles } from "@/Service/RoleService";

interface EditProfileModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;

  currentUser?: CurrentUserProfile;
}

export function EditProfileModal({
  isOpen,
  setIsOpen,
  onClose,
  currentUser,
}: EditProfileModalProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<LawyerProfileRequest>({
    defaultValues: {
      fullName: "",
      gender: "MALE",
      lawyerStatus: "ACTIVE",
      email: "",
      phoneNumber: "",
      password: "",
      roleId: 1,
      title: "",
      description: "",
      image: "",
      expertiseIdList: [],
      facebookLink: "",
      tiktokLink: "",
      telegramLink: "",
    },
  });

  const { list } = GetExpertiseList();
  const role = getRoles();
  const EXPERTISE_OPTIONS = list;
  const expertises = watch("expertiseIdList");
  const [inputExpertise, setInputExpertise] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState(Object);

  // Populate form with current user data when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      // Map expertise names to their IDs from the list
      const expertiseIds = (currentUser.expertises || [])
        .map((expertiseName: string) => {
          const found = list.find((e: any) => e.expertName === expertiseName);
          return found?.expertiseId || 0;
        })
        .filter((id: number) => id !== 0);
      const roleId =
        role.list.find((r: any) => r.roleName === currentUser.role)?.roleId ||
        1;
      reset({
        fullName: currentUser.fullName || "",
        gender: currentUser.gender || "MALE",
        lawyerStatus: currentUser.lawyerStatus || "ACTIVE",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        password: "", // Don't populate password for security
        roleId: roleId,
        title: currentUser.title || "",
        description: currentUser.description || "",
        image: currentUser.image || "",
        expertiseIdList: expertiseIds,
        facebookLink: currentUser.facebookLink || "",
        tiktokLink: currentUser.tiktokLink || "",
        telegramLink: currentUser.telegramLink || "",
      });
      setUploadedImagePath(Object);
    }
  }, [isOpen, currentUser, reset, list]);

  const handleUploadImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulated upload - replace with your actual API call

    setUploadedImagePath(file); // uploadedImagePath = file
  };

  const handleAddExpertise = (expertiseId: number) => {
    if (!expertises.includes(expertiseId)) {
      const newExpertises = [...expertises, expertiseId];
      setValue("expertiseIdList", newExpertises, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setInputExpertise("");
    }
  };

  const handleRemoveExpertise = (expertise: number) => {
    const newExpertises = expertises.filter((e: any) => e !== expertise);
    reset({
      ...watch(),
      expertiseIdList: newExpertises,
    });
  };

  const getExpertiseName = (id: number) =>
    list.find((e: any) => e.expertiseId === id)?.expertName ?? "Unknown";

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveData = async (data: LawyerProfileRequest) => {
    try {
      setIsLoading(true);
      const fd = new FormData();
      fd.append("file", uploadedImagePath);
      const { payload } = await request(
        `files/upload-file`,
        "POST",
        fd,
        undefined,
        "multipart/form-data",
      );
      const finishedData: LawyerProfileRequest = {
        ...data,
        image: payload?.fileName,
      };

      const res = await updateProfileService(finishedData);
      console.log("Update profile response:", res);
      if (res.success) {
        toast.success(res.message);
        reset();
        setUploadedImagePath(Object);
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99999  flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="no-scrollbar relative w-full mx-auto max-w-[700px] max-h-screen overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>

        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Your Profile
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSaveData)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name </Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <span className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender </Label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <span className="text-red-500 text-sm">
                    {errors.gender.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Professional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title </Label>
                <Input
                  id="title"
                  placeholder="e.g., Head of Litigation & Dispute Resolution"
                  {...register("title", {
                    required: "Professional title is required",
                  })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lawyerStatus">Lawyer Status </Label>
                <Controller
                  name="lawyerStatus"
                  control={control}
                  rules={{ required: "Lawyer status is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.lawyerStatus && (
                  <span className="text-red-500 text-sm">
                    {errors.lawyerStatus.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Professional Description</Label>
              <Textarea
                id="description"
                placeholder="Enter professional background and experience..."
                rows={5}
                {...register("description")}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="expertise-select">Your Expertise</Label>
              <div className="flex gap-2">
                <Select
                  value={inputExpertise}
                  onValueChange={setInputExpertise}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select expertise area" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERTISE_OPTIONS.map((e) => (
                      <SelectItem
                        key={e.expertiseId}
                        value={String(e.expertiseId)}
                      >
                        {e.expertName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddExpertise(Number(inputExpertise))}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertises.map((id) => (
                  <Badge key={id} variant="secondary" className="px-3 py-1">
                    {getExpertiseName(id)}
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(id)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Credentials Section */}
          {/* {Num ?? ( */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Credentials & Security</h3>

            <div className="space-y-2">
              <Label htmlFor="password">Password </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          {/* )} */}

          {/* Social Media Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Social Media & Links</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookLink">Facebook Link</Label>
                <Input
                  id="facebookLink"
                  type="url"
                  placeholder="https://facebook.com/..."
                  {...register("facebookLink")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktokLink">TikTok Link</Label>
                <Input
                  id="tiktokLink"
                  type="url"
                  placeholder="https://tiktok.com/..."
                  {...register("tiktokLink")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramLink">Telegram Link</Label>
                <Input
                  id="telegramLink"
                  type="url"
                  placeholder="https://t.me/..."
                  {...register("telegramLink")}
                />
              </div>
            </div>
            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium mb-3 text-white/80">
                Upload Image
              </label>
              <input
                type="file"
                id="clientImage"
                onChange={handleUploadImage}
                className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-4 py-3 cursor-pointer text-white file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 file:transition-all file:duration-300"
                accept="image/*"
              />
              {uploadedImagePath && (
                <p className="text-sm text-green-400 mt-2 flex items-center">
                  {uploadedImagePath?.name && (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {uploadedImagePath?.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 items-end justify-end pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentUser) {
                  // Map expertise names to their IDs from the list
                  const expertiseIds = (currentUser.expertises || [])
                    .map((expertiseName: string) => {
                      const found = list.find(
                        (e: any) => e.expertName === expertiseName,
                      );
                      return found?.expertiseId || 0;
                    })
                    .filter((id: number) => id !== 0);

                  reset({
                    fullName: currentUser.fullName || "",
                    gender: currentUser.gender || "MALE",
                    lawyerStatus: currentUser.lawyerStatus || "ACTIVE",
                    email: currentUser.email || "",
                    phoneNumber: currentUser.phoneNumber || "",
                    password: "",
                    roleId: currentUser.role ? Number(currentUser.role) : 1,
                    title: currentUser.title || "",
                    description: currentUser.description || "",
                    image: currentUser.image || "",
                    expertiseIdList: expertiseIds,
                    facebookLink: currentUser.facebookLink || "",
                    tiktokLink: currentUser.tiktokLink || "",
                    telegramLink: currentUser.telegramLink || "",
                  });
                  setUploadedImagePath(Object);
                }
              }}
            >
              Reset Form
            </Button>
            <Button disabled={isLoading} type="submit">
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
