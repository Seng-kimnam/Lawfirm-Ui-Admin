"use client";

import { getAppointmentList } from "../constants/constants_url";
import { request } from "../constants/api";
import { useEffect, useState } from "react";
import type {
  AppointmentFormData,
  AppointmentInterface,
} from "@/model/Appointment";

function isValidISODate(dateStr: string): boolean {
  if (!dateStr || dateStr === "string" || dateStr.length < 10) {
    return false;
  }
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function parseDate(dateStr: string): string | null {
  if (!isValidISODate(dateStr)) {
    return null;
  }
  // Handle "2026-01-15T14:11:44.654" format
  if (dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  return null;
}

function parseTime(timeStr: string): string {
  if (!timeStr || timeStr === "string") {
    return "09:00";
  }
  // Handle ISO format "2025-12-23T14:11:44.654"
  if (timeStr.includes("T") && timeStr.length > 11) {
    return timeStr.substring(11, 16);
  }
  // Handle HH:mm format
  if (/^\d{2}:\d{2}/.test(timeStr)) {
    return timeStr.substring(0, 5);
  }
  return "09:00";
}

export const GetAllAppointment = () => {
  const [appointmentList, setAppointmentList] = useState<
    AppointmentInterface[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request(
        getAppointmentList(page),
        "GET",
        undefined,
        undefined
      );

      if (!res || !res.payload) throw new Error("No data received");

      const rawAppointments = res?.payload?.content || [];

      const parsedAppointments = rawAppointments
        .map((apt: AppointmentInterface) => {
          const parsedDate = parseDate(apt.appointmentDate);
          const parsedTime = parseTime(apt.appointmentTime);

          return {
            ...apt,
            appointmentDate: parsedDate,
            appointmentTime: parsedTime,
          };
        })
        .filter((apt: AppointmentInterface) => apt.appointmentDate !== null);

      setAppointmentList(parsedAppointments);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return {
    appointmentList,
    page,
    setPage,
    totalPage,
    loading,
    refetch: fetchData,
  };
};

export const GetDefaultAppointmentList = () => {
  const [appointmentList, setAppointmentList] = useState<
    AppointmentInterface[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request(
        getAppointmentList(page),
        "GET",
        undefined,
        undefined
      );

      if (!res || !res.payload) throw new Error("No data received");

      const rawAppointments = res?.payload?.content || [];

      setAppointmentList(rawAppointments);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return {
    appointmentList,
    page,
    setPage,
    totalPage,
    loading,
    refetch: fetchData,
    parseDate,
    parseTime,
  };
};

export const PostAppointmentService = async (req?: AppointmentFormData) => {
  const response = await request("appointments", "POST", req);

  console.log("service appointment response:", response);
  return response; // Always return the response (even if success: false)
};
