"use client";

import type React from "react";

import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Briefcase,
  Phone,
  Mail,
  Scale,
  FileText,
  Video,
  PhoneCall,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentInterface } from "@/model/Appointment";

interface Client {
  clientId: number;
  clientName: string;
  email: string;
  phoneNumber: string;
  complaint: string;
  address: string;
  status: string;
  clientImage: string;
  createdAt: string;
  updatedAt: string;
}

interface Court {
  courtId: number;
  courtName: string;
  courtType: string;
  location: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface LegalCase {
  caseId: number;
  client: Client;
  court: Court;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  appointmentId: number;
  legalCase: LegalCase;
  appointmentDate: string;
  appointmentTime: string;
  meetingType: "IN_PERSON" | "VIRTUAL" | "PHONE";
  location: string;
  purpose: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

interface AppointmentDetailCardProps {
  appointment: AppointmentInterface;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  PENDING: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  CONFIRMED: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  CANCELLED: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  COMPLETED: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
};

const meetingTypeConfig: Record<
  string,
  { icon: React.ReactNode; label: string }
> = {
  IN_PERSON: { icon: <Users className="h-4 w-4" />, label: "In Person" },
  VIRTUAL: { icon: <Video className="h-4 w-4" />, label: "Virtual" },
  PHONE: { icon: <PhoneCall className="h-4 w-4" />, label: "Phone Call" },
};

const courtTypeLabels: Record<string, string> = {
  SUPREME_COURT: "Supreme Court",
  APPELLATE_COURT: "Appellate Court",
  DISTRICT_COURT: "District Court",
  MUNICIPAL_COURT: "Municipal Court",
};

function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const AppointmentCardComponent = ({
  appointment,
  onEdit,
  onDelete,
}: AppointmentDetailCardProps) => {
  const { task, status, meetingType } = appointment;
  const { lawyer, legalCase } = task;
  const statusStyle = statusConfig[status] || statusConfig.PENDING;
  const meetingInfo =
    meetingTypeConfig[meetingType] || meetingTypeConfig.IN_PERSON;

  console.log("DE", appointment);
  return (
    <Card className="w-full  border border-border shadow-lg overflow-hidden">
      {/* Header with Status */}
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {appointment.purpose}
            </h3>
            <p className="text-sm text-muted-foreground">
              Appointment #{appointment.appointmentId}
            </p>
          </div>
          <Badge
            className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium text-foreground">
                {formatDate(appointment.appointmentDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-medium text-foreground">
                {appointment.appointmentTime || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">
                {appointment.location || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              {meetingInfo.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Meeting Type</p>
              <p className="text-sm font-medium text-foreground">
                {meetingInfo.label}
              </p>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Lawyer Information
          </h4>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-semibold">
                {lawyer.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium text-foreground">
                    {lawyer.fullName}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {lawyer.lawyerStatus.charAt(0) +
                      lawyer.lawyerStatus.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{lawyer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{lawyer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{lawyer.gender}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Case Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            Case Information
          </h4>
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{legalCase.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Case #{legalCase.caseId}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {legalCase.status.charAt(0) +
                  legalCase.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {legalCase.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Start: {formatDateTime(legalCase.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>End: {formatDateTime(legalCase.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Court Information */}
        {/* <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Scale className="h-4 w-4 text-muted-foreground" />
            Court Information
          </h4>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-foreground">
                    {court.courtName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {courtTypeLabels[court.courtType] ||
                      court.courtType.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{court.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{court.contactNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                Edit Appointment
              </button>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Created: {formatDateTime(appointment.createdAt)}</span>
          <span>Updated: {formatDateTime(appointment.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCardComponent;
