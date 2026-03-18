"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import { LawyerProfileRequest } from "@/model/Lawyer";
import { GetExpertiseList } from "@/Service/ServiceTypeService";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  fetchLawyerById,
  registerLawyerService,
  updateLawyerByIdService,
} from "@/Service/UserService";
import { request } from "@/constants/api";
import { base_Url } from "@/constants/constants_url";

const LawyerForm = () => {
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
      roleId: 2,
      title: "",
      description: "",
      image: "",
      expertiseIdList: [],
      facebookLink: "",
      tiktokLink: "",
      telegramLink: "",
    },
  });
  const { id } = useParams<{ id: string }>();
  const goto = useNavigate();
  const isEdit = Number.isFinite(Number(id)) && Number(id) > 0;

  const { list } = GetExpertiseList();
  const EXPERTISE_OPTIONS = list;
  const expertises = watch("expertiseIdList");
  const currentImage = watch("image");
  const [inputExpertise, setInputExpertise] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState<File | null>(null);
  const [isPrefilling, setIsPrefilling] = useState(false);
  const [prefillExpertises, setPrefillExpertises] = useState<any[]>([]);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(
    null,
  );

  async function handleUploadImage(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    // Simulated upload - replace with your actual API call

    setUploadedImagePath(file); // uploadedImagePath = file
  }

  useEffect(() => {
    if (!uploadedImagePath) {
      setUploadedPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedImagePath);
    setUploadedPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedImagePath]);

  useEffect(() => {
    if (!isEdit) return;

    let cancelled = false;

    const run = async () => {
      setIsPrefilling(true);
      try {
        const lawyer = await fetchLawyerById(id as string);
        if (cancelled) return;

        if (!lawyer) {
          toast.error("Failed to load lawyer details.");
          return;
        }

        const gender = String(lawyer.gender ?? "MALE").toUpperCase();
        const normalizedGender =
          gender === "MALE" || gender === "FEMALE" || gender === "OTHER"
            ? gender
            : "MALE";

        const status = String(lawyer.lawyerStatus ?? "ACTIVE").toUpperCase();
        const normalizedStatus =
          status === "ACTIVE" || status === "INACTIVE" || status === "SUSPENDED"
            ? status
            : "ACTIVE";

        const rawExpertiseList =
          (lawyer as any).expertiseIdList ??
          (lawyer as any).expertises ??
          (lawyer as any).expertiseList ??
          [];
        setPrefillExpertises(
          Array.isArray(rawExpertiseList) ? rawExpertiseList : [],
        );

        const normalizeExpertiseIds = (items: any[], listOptions: any[]) =>
          items
            .map((item) => {
              if (typeof item === "number") return item;
              if (typeof item === "string") {
                const asNumber = Number(item);
                if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;
                const byName = listOptions.find(
                  (e) => e.expertName === item,
                );
                return Number(byName?.expertiseId ?? NaN);
              }
              if (item && typeof item === "object") {
                return Number((item as { expertiseId?: number }).expertiseId);
              }
              return NaN;
            })
            .filter((id) => Number.isFinite(id) && id > 0);

        reset({
          fullName: lawyer.fullName ?? "",
          gender: normalizedGender,
          lawyerStatus: normalizedStatus,
          email: lawyer.email ?? "",
          phoneNumber: lawyer.phoneNumber ?? "",
          password: "",
          roleId: typeof lawyer.roleId === "number" ? lawyer.roleId : 2,
          title: lawyer.title ?? "",
          description: lawyer.description ?? "",
          image: typeof lawyer.image === "string" ? lawyer.image : "",
          expertiseIdList: Array.isArray(rawExpertiseList)
            ? normalizeExpertiseIds(rawExpertiseList, list)
            : [],
          facebookLink: lawyer.facebookLink ?? "",
          tiktokLink: lawyer.tiktokLink ?? "",
          telegramLink: lawyer.telegramLink ?? "",
        });
      } catch (err) {
        if (!cancelled) toast.error("Failed to load lawyer details.");
      } finally {
        if (!cancelled) setIsPrefilling(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, reset]);

  useEffect(() => {
    if (!isEdit) return;
    if (expertises.length > 0) return;
    if (prefillExpertises.length === 0) return;
    if (list.length === 0) return;

    const normalized = prefillExpertises
      .map((item) => {
        if (typeof item === "number") return item;
        if (typeof item === "string") {
          const asNumber = Number(item);
          if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;
          const byName = list.find((e) => e.expertName === item);
          return Number(byName?.expertiseId ?? NaN);
        }
        if (item && typeof item === "object") {
          return Number((item as { expertiseId?: number }).expertiseId);
        }
        return NaN;
      })
      .filter((id) => Number.isFinite(id) && id > 0);

    if (normalized.length > 0) {
      setValue("expertiseIdList", normalized, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [expertises.length, isEdit, list, prefillExpertises, setValue]);

  const handleAddExpertise = (expertiseId: number) => {
    if (!expertiseId) return;
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
    const newExpertises = expertises.filter((e) => e !== expertise);
    setValue("expertiseIdList", newExpertises, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  const getExpertiseName = (id: number) =>
    list.find((e) => e.expertiseId === id)?.expertName ?? "Unknown";
  const [isLoading, setIsLoading] = useState(false);

  const hanleSaveData = async (data: LawyerProfileRequest) => {
    try {
      setIsLoading(true);

      let imageName = data.image;
      if (uploadedImagePath) {
        const fd = new FormData();
        fd.append("file", uploadedImagePath);
        const { payload } = await request(
          `files/upload-file`,
          "POST",
          fd,
          undefined,
          "multipart/form-data",
        );
        imageName = payload?.fileName ?? imageName;
      } else if (!isEdit) {
        toast.error("Please upload an image.");
        return;
      }

      const finishedData: LawyerProfileRequest = {
        ...data,
        image: imageName,
      };

      const payloadToSend: Partial<LawyerProfileRequest> =
        isEdit && !finishedData.password.trim()
          ? (() => {
              const { password, ...rest } = finishedData;
              return rest;
            })()
          : finishedData;

      const res = isEdit
        ? await updateLawyerByIdService(id as string, payloadToSend)
        : await registerLawyerService(finishedData);
      
      if (res.success) {
        toast.success(res.message);
        if (isEdit) {
          goto("/list-lawyer");
        } else {
          reset();
          setUploadedImagePath(null);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Lawyer Profile</CardTitle>
        <CardDescription>
          {isEdit ? "Edit" : "Create new"} lawyer information and expertise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(hanleSaveData)} className="space-y-8">
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
                        <SelectItem value="OTHER">Other</SelectItem>
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
                  placeholder="Ex: john.doe@gmail.com"
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
                  placeholder="Ex: +85512345678"
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
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
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
              <Label htmlFor="expertise-select">Areas of Expertise</Label>
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
                {expertises.length > 0 ? (
                  expertises.map((id) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No expertise selected yet.
                  </p>
                )}
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
                  required: isEdit ? false : "Password is required",
                  validate: (value) => {
                    if (!value) return true;
                    return (
                      value.length >= 6 ||
                      "Password must be at least 6 characters"
                    );
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
              {uploadedPreviewUrl ? (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    New image preview:
                  </p>
                  <img
                    src={uploadedPreviewUrl}
                    alt="New lawyer profile preview"
                    className="h-32 w-32 rounded-xl object-cover border border-white/20"
                  />
                </div>
              ) : (
                isEdit &&
                currentImage && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      Current image:
                    </p>
                    <img
                      src={`${base_Url}files/preview-file?fileName=${encodeURIComponent(
                        currentImage,
                      )}`}
                      alt="Current lawyer profile"
                      className="h-32 w-32 rounded-xl object-cover border border-white/20"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Current image filename: {currentImage}
                    </p>
                  </div>
                )
              )}
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
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset Form
            </Button>
            <Button
              type="submit"
              className={`${
                isEdit
                  ? "bg-green-600   hover:bg-green-800"
                  : "bg-blue-600   hover:bg-blue-800"
              } text-white`}
              disabled={isLoading || isPrefilling}
            >
              {isLoading
                ? "Saving..."
                : isEdit
                  ? "Update lawyer"
                  : "Save new lawyer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default LawyerForm;
