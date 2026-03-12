"use client";

import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventInput,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";
import { Modal } from "@/components/ui/modal";
import { CalendarDays, MapPin, Clock, User } from "lucide-react";
import type {
  AppointmentFormData,
  AppointmentInterface,
} from "@/model/Appointment";
import {
  GetAllAppointment,
  PutAppointmentService,
  PostAppointmentService,
} from "@/Service/AppointmentService";
import { useModal } from "@/hooks/useModal";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Label from "@/components/form/Label";
import toast from "react-hot-toast";
import { GetTask } from "@/Service/TaskService";

interface CalendarEvent extends EventInput {
  extendedProps: {
    appointment: AppointmentInterface;
  };
}

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

// Status colors mapping
const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-blue-500",
  CANCELLED: "bg-red-500",
  FINISHED: "bg-emerald-500",
};

const statusBorderColors: Record<string, string> = {
  PENDING: "border-l-amber-500",
  CONFIRMED: "border-l-blue-500",
  CANCELLED: "border-l-red-500",
  FINISHED: "border-l-emerald-500",
};

const AppointmentCalendar = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentInterface | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { appointmentList, loading, refetch } = GetAllAppointment();
  const { taskList } = GetTask();
  const todayInputMin = getLocalDateInputValue(new Date());

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      taskId: 0,
      purpose: "",
      location: "",
      appointmentDate: "",
      appointmentTime: "09:00",
      meetingType: "IN_PERSON",
      status: "PENDING",
    },
  });

  useEffect(() => {
    const calendarEvents: CalendarEvent[] = appointmentList.map((apt) => ({
      id: apt.appointmentId.toString(),
      title: `${apt.purpose} - ${apt.task.lawyer.fullName}`,
      start: `${apt.appointmentDate}T${apt.appointmentTime}:00`,
      backgroundColor: statusColors[apt.status]?.replace("bg-", ""),
      borderColor: "transparent",
      extendedProps: {
        appointment: apt,
      },
    }));
    setEvents(calendarEvents);
  }, [appointmentList]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (isBeforeToday(selectInfo.start)) {
      toast.error("You can only create appointments for today or a future date.");
      calendarRef.current?.getApi().unselect();
      return;
    }
    setSelectedAppointment(null);
    reset({
      taskId: 0,
      purpose: "",
      location: "",
      appointmentDate: selectInfo.startStr.split("T")[0],
      appointmentTime: "09:00",
      meetingType: "IN_PERSON",
      status: "PENDING",
    });
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps
      .appointment as AppointmentInterface;
    setSelectedAppointment(appointment);
    reset({
      taskId: appointment.task?.taskId || 0,
      purpose: appointment.purpose,
      location: appointment.location,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      meetingType:
        appointment.meetingType as AppointmentFormData["meetingType"],
      status: appointment.status as AppointmentFormData["status"],
    });
    openModal();
  };

  const onSubmit = async (data: AppointmentFormData) => {
    if (!selectedAppointment) {
      const dateCandidate = new Date(`${data.appointmentDate}T00:00:00`);
      if (!data.appointmentDate || Number.isNaN(dateCandidate.getTime())) {
        setError("appointmentDate", {
          type: "manual",
          message: "Date is required",
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
      const payload = {
        ...data,
        taskId: Number(data.taskId),
      };

      const res = selectedAppointment
        ? await PutAppointmentService(
            selectedAppointment.appointmentId,
            payload,
          )
        : await PostAppointmentService(payload);

      if (res?.success) {
        toast.success(
          selectedAppointment
            ? "Appointment updated successfully."
            : "Appointment created successfully.",
        );
        await refetch();
        closeModal();
        return;
      }

      toast.error(res?.message || "Failed to save appointment.");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to save appointment.";
      toast.error(message);
    }
  };

  const handleDelete = () => {
    // TODO: Add delete logic
  };

  const renderEventContent = (eventInfo: {
    event: { extendedProps: { appointment: AppointmentInterface } };
    timeText: string;
  }) => {
    const appointment = eventInfo.event.extendedProps.appointment;
    return (
      <div
        className={`flex flex-col p-1.5 rounded text-xs text-white border-l-4 ${
          statusBorderColors[appointment.status]
        } bg-opacity-90`}
        style={{ backgroundColor: getStatusColor(appointment.status) }}
      >
        <div className="font-medium truncate">{appointment.purpose}</div>
        <div className="opacity-90 truncate">
          {appointment.task.lawyer.fullName}
        </div>
        <div className="opacity-75 text-[10px]">{eventInfo.timeText}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">
            Loading appointments...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          {Object.keys(statusColors).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
              <span className="text-muted-foreground capitalize">
                {status.toLowerCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          selectAllow={(selectInfo) => !isBeforeToday(selectInfo.start)}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height="auto"
          eventDisplay="block"
        />
      </div>

      {/* Appointment Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl p-10 ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {selectedAppointment ? "Edit Appointment" : "New Appointment"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedAppointment
                ? `Task title: ${selectedAppointment.task.title}`
                : "Schedule a new appointment"}
            </p>
          </div>

          {/* Client Info (if editing) */}
          {selectedAppointment ? (
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium text-xl text-foreground">
                  {selectedAppointment.task.lawyer.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {/* <Briefcase className="h-4 w-4" />
                <span>
                  {selectedAppointment.task.legalCase.court.courtName}
                </span> */}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="caseId">Task</Label>
              <Controller
                name="taskId"
                control={control}
                rules={{ required: "Please select your task" }}
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                    <SelectContent sideOffset={4}>
                      <SelectGroup>
                        <SelectLabel>Available Tasks</SelectLabel>
                        {taskList.length > 0 ? (
                          taskList.map((task) => (
                            <SelectItem
                              key={task.taskId}
                              value={task.taskId.toString()}
                            >
                              {task.taskId}. {task.title} -{" "}
                              {task.lawyer.fullName}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-sm text-muted-foreground">
                            No tasks available
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.taskId && (
                <p className="text-sm text-destructive">
                  {errors.taskId.message}
                </p>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Purpose
              </label>
              <input
                type="text"
                {...register("purpose", { required: "Purpose is required" })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Initial Consultation"
              />
              {errors.purpose && (
                <p className="text-sm text-destructive mt-1">
                  {errors.purpose.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <CalendarDays className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  min={selectedAppointment ? undefined : todayInputMin}
                  {...register("appointmentDate", {
                    required: "Date is required",
                  })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  {...register("appointmentTime", {
                    required: "Time is required",
                  })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.appointmentTime && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Conference Room A"
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Meeting Type
              </label>
              <Controller
                name="meetingType"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {(["IN_PERSON", "ONLINE"] as const).map((type) => (
                      <label
                        key={type}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                          field.value === type
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-input hover:bg-muted text-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          value={type}
                          checked={field.value === type}
                          onChange={() => field.onChange(type)}
                          className="sr-only"
                        />
                        <span className="text-sm">
                          {type.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-3">
                    {(
                      ["PENDING", "CONFIRMED", "CANCELLED", "FINISHED"] as const
                    ).map((statusOption) => (
                      <label
                        key={statusOption}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                          field.value === statusOption
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-input hover:bg-muted text-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          value={statusOption}
                          checked={field.value === statusOption}
                          onChange={() => field.onChange(statusOption)}
                          className="sr-only"
                        />
                        <div
                          className={`w-2 h-2 rounded-full ${statusColors[statusOption]}`}
                        />
                        <span className="text-sm capitalize">
                          {statusOption.toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {selectedAppointment ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                {selectedAppointment ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    CANCELLED: "#ef4444",
    FINISHED: "#10b981",
  };
  return colors[status];
}

export default AppointmentCalendar;
