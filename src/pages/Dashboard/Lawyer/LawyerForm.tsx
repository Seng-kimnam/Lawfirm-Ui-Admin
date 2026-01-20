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
import { useState } from "react";
import Label from "@/components/form/Label";

interface LawyerFormData {
  fullName: string;
  gender: "MALE" | "FEMALE";
  lawyerStatus: "ACTIVE" | "INACTIVE";
  email: string;
  phoneNumber: string;
  password: string;
  title: string;
  description: string;
  expertises: string[];
  facebookLink?: string;
  tiktokLink?: string;
  telegramLink?: string;
}

const EXPERTISE_OPTIONS = [
  "Banking & Finance",
  "Litigation & Dispute Resolution",
  "Consumer Goods & Retail",
  "Labour & Employment",
  "Corporate Law",
  "Real Estate & Construction",
  "Foreign Investment",
  "Aviation & Airline",
  "Security & Capital Market",
  "Insolvency & Dissolution",
  "Public Relations & Regulatory Advocacy",
];

interface LawyerFormProps {
  initialData?: Partial<LawyerFormData>;
  onSubmit: (data: LawyerFormData) => void;
  isLoading?: boolean;
}

const LawyerForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: LawyerFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<LawyerFormData>({
    defaultValues: {
      fullName: initialData?.fullName || "",
      gender: initialData?.gender || "MALE",
      lawyerStatus: initialData?.lawyerStatus || "ACTIVE",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      password: initialData?.password || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      expertises: initialData?.expertises || [],
      facebookLink: initialData?.facebookLink || "",
      tiktokLink: initialData?.tiktokLink || "",
      telegramLink: initialData?.telegramLink || "",
    },
  });

  const expertises = watch("expertises");
  const [inputExpertise, setInputExpertise] = useState("");

  const handleAddExpertise = (expertise: string) => {
    if (expertise && !expertises.includes(expertise)) {
      const newExpertises = [...expertises, expertise];
      setValue("expertises", newExpertises, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setInputExpertise("");
    }
  };

  const handleRemoveExpertise = (expertise: string) => {
    const newExpertises = expertises.filter((e) => e !== expertise);
    reset({
      ...watch(),
      expertises: newExpertises,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Lawyer Profile</CardTitle>
        <CardDescription>
          Manage lawyer information and expertise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    {EXPERTISE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddExpertise(inputExpertise)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertises.map((expertise) => (
                  <Badge
                    key={expertise}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {expertise}
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(expertise)}
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
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Lawyer Profile"}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default LawyerForm;
