import { Controller, useForm } from "react-hook-form";

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
import {
  GetAppointmentById,
  PostAppointmentService,
  PutAppointmentService,
} from "@/Service/AppointmentService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GetTask } from "@/Service/TaskService";
import BtnBackComponent from "@/components/BtnBackComponent";

// const meetingTypeEnum = ["IN_PERSON", "VIRTUAL", "HYBRID"] as const;
const appointmentSchema = z.object({
  taskId: z.coerce
    .number()
    .int()
    .nonnegative("Task ID must be a non-negative number"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  meetingType: z.enum(["IN_PERSON", "ONLINE"]),
  location: z.string().min(1, "Location is required"),
  purpose: z
    .string()
    .min(1, "Purpose is required")
    .max(500, "Purpose must be less than 500 characters"),
  status: z.enum(["PENDING", "CONFIRMED", "FINISHED", "CANCELLED"]),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const getLocalDateInputValue = (date: Date) => {
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
};

const isBeforeToday = (date: Date) => {
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return candidate < today;
};

const formatDateForInput = (date: string) => {
  if (!date) return "";
  return date.includes("T") ? date.split("T")[0] : date;
};

const formatTimeForInput = (time: string) => {
  if (!time) return "";
  if (time.includes("T")) return time.substring(11, 16);
  return time.substring(0, 5);
};

type taskForDropdown = {
  taskId: number;
  title: string;
  lawyerName?: string;
};

type AppointmentTaskShape = {
  task?: { taskId?: number | string; id?: number | string };
  taskId?: number | string;
};

const getTaskIdFromAppointment = (
  appointmentData: AppointmentTaskShape,
): number => {
  const rawTaskId =
    appointmentData?.task?.taskId ??
    appointmentData?.taskId ??
    appointmentData?.task?.id;

  const parsedTaskId = Number(rawTaskId);
  return Number.isFinite(parsedTaskId) ? parsedTaskId : 0;
};

export default function CreateAppointmentForm() {
  const { id } = useParams<{ id: string }>();
  const goto = useNavigate();
  const [currentAppointment, setCurrentAppointment] =
    useState<AppointmentFormData | null>(null);
  const [taskOptionsIdAndTitle, setTaskOptionsIdAndTitle] = useState<
    taskForDropdown[]
  >([]);
  const { taskList } = GetTask();
  useEffect(() => {
    if (taskList && taskList.length > 0) {
      const options = taskList.map((task) => ({
        taskId: task.taskId,
        title: task.title,
        lawyerName: task.lawyer.fullName,
      }));
      setTaskOptionsIdAndTitle(options);
    }
  }, [taskList]);
  console.log("Task options for dropdown:", taskOptionsIdAndTitle);
  useEffect(() => {
    if (id) {
      const fetchAppointment = async () => {
        try {
          const res = await GetAppointmentById(Number(id));
          if (res.success) {
            const appointmentData = res.payload;
            const selectedTaskId = getTaskIdFromAppointment(appointmentData);
            setCurrentAppointment({
              taskId: selectedTaskId,
              appointmentDate: formatDateForInput(
                appointmentData.appointmentDate,
              ),
              appointmentTime: formatTimeForInput(
                appointmentData.appointmentTime,
              ),
              meetingType:
                appointmentData.meetingType === "ONLINE"
                  ? "ONLINE"
                  : "IN_PERSON",
              location: appointmentData.location,
              purpose: appointmentData.purpose,
              status: [
                "PENDING",
                "CONFIRMED",
                "FINISHED",
                "CANCELLED",
              ].includes(appointmentData.status)
                ? appointmentData.status
                : "PENDING",
            });
          } else {
            toast.error("Failed to fetch appointment details.");
          }
        } catch (error) {
          console.error("Error fetching appointment details:", error);
          toast.error("An error occurred while fetching appointment details.");
        }
      };

      fetchAppointment();
    }
  }, [id]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
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
  const status = watch("status");
  const defaultTaskOptions = taskOptionsIdAndTitle.map((option) =>
    String(option.taskId),
  );
  const todayInputMin = getLocalDateInputValue(new Date());

  useEffect(() => {
    if (currentAppointment) {
      reset(currentAppointment);
    }
  }, [currentAppointment, reset]);

  const onSubmit = async (data: AppointmentFormData) => {
    if (!id) {
      const dateCandidate = new Date(`${data.appointmentDate}T00:00:00`);
      if (!data.appointmentDate || Number.isNaN(dateCandidate.getTime())) {
        setError("appointmentDate", {
          type: "manual",
          message: "Appointment date is required",
        });
        return;
      }
      if (isBeforeToday(dateCandidate)) {
        setError("appointmentDate", {
          type: "manual",
          message: "Appointment date must be today or later",
        });
        toast.error("Appointment date must be today or later.");
        return;
      }
    }

    try {
      const res = id
        ? await PutAppointmentService(Number(id), data)
        : await PostAppointmentService(data);
      const { detail, status } = res?.response?.data || {};
      if (res.success) {
        toast.success(
          `Appointment ${id ? "updated" : "created"} successfully!`,
        );
        goto("/list-appointment");
      }
      if (status === 400) {
        toast.error(detail || "Validation error. Please check your input.");
      }
      if (res.response) console.log("Appointment created:", data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <BtnBackComponent url="/list-appointment" />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {id ? "Edit Appointment" : "Create New Appointment"}
          </CardTitle>
          <CardDescription>
            Fill in the details to schedule a new appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Task ID */}
            <div className="space-y-2">
              <Label htmlFor="taskId">Task ID and Title</Label>
              <Controller
                name="taskId"
                control={control}
                render={({ field }) => {
                  const selectedTaskId = Number(field.value);
                  const selectedTaskValue =
                    Number.isFinite(selectedTaskId) && selectedTaskId > 0
                      ? String(selectedTaskId)
                      : "";
                  const taskOptions =
                    selectedTaskValue &&
                    !defaultTaskOptions.includes(selectedTaskValue)
                      ? [selectedTaskValue, ...defaultTaskOptions]
                      : defaultTaskOptions;

                  return (
                    <Select
                      value={selectedTaskValue || undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        id="taskId"
                        className={errors.taskId ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select task ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskOptions.map((taskOptionId) => (
                          <SelectItem key={taskOptionId} value={taskOptionId}>
                            Task {taskOptionId} -{" "}
                            {taskOptionsIdAndTitle.find(
                              (option) =>
                                String(option.taskId) === String(taskOptionId),
                            )?.title || "Unknown Task"}{" "}
                            -{" "}
                            {taskOptionsIdAndTitle.find(
                              (option) =>
                                String(option.taskId) === String(taskOptionId),
                            )?.lawyerName || "Unknown Task"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
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
                min={id ? undefined : todayInputMin}
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
                onValueChange={(value) =>
                  setValue("meetingType", value as "IN_PERSON" | "ONLINE")
                }
              >
                <SelectTrigger
                  id="meetingType"
                  className={errors.meetingType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_PERSON">In Person</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                </SelectContent>
              </Select>
              {errors.meetingType && (
                <p className="text-sm text-red-500">
                  {errors.meetingType.message}
                </p>
              )}
            </div>
            {/* status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue(
                    "status",
                    value as "PENDING" | "CONFIRMED" | "FINISHED" | "CANCELLED",
                  )
                }
              >
                <SelectTrigger
                  id="status"
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
            <Button
              type="submit"
              className="w-full dark:hover:bg-green-600 dark:hover:text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : id
                  ? "Update Appointment"
                  : "Create Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
