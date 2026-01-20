import { request } from "@/constants/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import AppoinmentCardComponent from "./components/AppoinmentCardComponent";
import { TaskInterface } from "@/model/Task";

/* =======================
   Interfaces
======================= */

interface Appointment {
  appointmentId: number;
  task: TaskInterface;
  appointmentDate: string;
  appointmentTime: string;
  meetingType: "IN_PERSON" | "VIRTUAL" | "PHONE";
  location: string;
  purpose: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

/* =======================
   Component
======================= */

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid appointment ID");
      setLoading(false);
      return;
    }

    async function fetchAppointmentById() {
      try {
        const res = await request(`appointments/${id}`, "GET");

        if (!res || !res.payload) {
          setError("Appointment not found");
        } else {
          setAppointment(res.payload);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointmentById();
  }, [id]);

  /* =======================
     Render States
  ======================= */

  if (loading) {
    return <div>Loading appointment...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }
  // At this point appointment is GUARANTEED
  return <AppoinmentCardComponent appointment={appointment} />;
};

export default AppointmentDetail;
