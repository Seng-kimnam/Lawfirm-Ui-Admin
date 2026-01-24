import { useForm } from "react-hook-form";

import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import Label from "@/components/form/Label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// const meetingTypeEnum = ["IN_PERSON", "VIRTUAL", "HYBRID"] as const;
const appointmentSchema = z.object({
  taskId: z.coerce
    .number()
    .int()
    .nonnegative("Task ID must be a non-negative number"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  meetingType: z.string(),
  location: z.string().min(1, "Location is required"),
  purpose: z
    .string()
    .min(1, "Purpose is required")
    .max(500, "Purpose must be less than 500 characters"),
  status: z.literal("PENDING"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function CreateAppointmentForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    // resolver: zodResolver(appointmentSchema),
    defaultValues: {
      taskId: 0,
      appointmentDate: "",
      appointmentTime: "",
      meetingType: "IN_PERSON",
      location: "",
      purpose: "",
      status: "PENDING",
    },
  });

  const meetingType = watch("meetingType");

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      console.log("[v0] Form submission data:", data);

      // Here you would normally call your API to create the appointment
      // const response = await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      //
      // if (!response.ok) throw new Error('Failed to create appointment')

      toast.success("Appointment created successfully!");
      console.log("Appointment created:", data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Appointment</CardTitle>
          <CardDescription>
            Fill in the details to schedule a new appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Task ID */}
            <div className="space-y-2">
              <Label htmlFor="taskId">Task ID</Label>
              <Input
                id="taskId"
                type="number"
                placeholder="Enter task ID"
                {...register("taskId")}
                className={errors.taskId ? "border-red-500" : ""}
              />
              {errors.taskId && (
                <p className="text-sm text-red-500">{errors.taskId.message}</p>
              )}
            </div>

            {/* Appointment Date */}
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                {...register("appointmentDate")}
                className={errors.appointmentDate ? "border-red-500" : ""}
              />
              {errors.appointmentDate && (
                <p className="text-sm text-red-500">
                  {errors.appointmentDate.message}
                </p>
              )}
            </div>

            {/* Appointment Time */}
            <div className="space-y-2">
              <Label htmlFor="appointmentTime">Appointment Time</Label>
              <Input
                id="appointmentTime"
                type="time"
                {...register("appointmentTime")}
                className={errors.appointmentTime ? "border-red-500" : ""}
              />
              {errors.appointmentTime && (
                <p className="text-sm text-red-500">
                  {errors.appointmentTime.message}
                </p>
              )}
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select
                value={meetingType}
                onValueChange={(value) => setValue("meetingType", value as any)}
              >
                <SelectTrigger
                  id="meetingType"
                  className={errors.meetingType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PERSON">In Person</SelectItem>
                  <SelectItem value="VIRTUAL">Virtual</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.meetingType && (
                <p className="text-sm text-red-500">
                  {errors.meetingType.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter meeting location"
                {...register("location")}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Enter appointment purpose"
                {...register("purpose")}
                className={errors.purpose ? "border-red-500" : ""}
                rows={4}
              />
              {errors.purpose && (
                <p className="text-sm text-red-500">{errors.purpose.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
