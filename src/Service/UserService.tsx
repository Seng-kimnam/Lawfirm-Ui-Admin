import { useEffect, useState } from "react";

import { registerUrl } from "../constants/constants_url";
import { request } from "../constants/api";
import { Lawyer, LawyerProfileRequest, Lawyers } from "@/model/Lawyer";
import { tr } from "date-fns/locale";

export const GetLawyers = () => {
  const [list, setList] = useState<Lawyer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const fetchData = async () => {
    try {
      const res = await request(
        "admins/lawyers/no-pagination",
        "GET",
        undefined,
        undefined,
      );

      if (!res || !res.payload) throw new Error("No data received");
      // map data from API
      setList(res.payload || []);

      setTotalPage(res.payload.totalPages || 1);
      setTotalElements(res?.payload?.totalElements);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return { list, page, totalElements, setPage, totalPage, refetch: fetchData };
};

// Add Lawyer
const token = localStorage.getItem("token");
export const postLawyer = async (data: Lawyer) => {
  try {
    const response = await request("auths/register", "POST", data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    alert(Error);
  }
};

export const registerLawyerService = async (data: LawyerProfileRequest) => {
  const response = await request(
    "auths/register",
    "POST",
    data,
    undefined,
    "application/json",
  );

  return response.data;
};
// Update Lawyer
// fetchLawyerById
export const fetchLawyerById = async (
  id: number | string,
): Promise<Lawyers | null> => {
  try {
    const res = await request(`lawyers/${id}`, "GET", undefined, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    if (!res || !res.payload) return null;

    return res.payload;
  } catch (err) {
    console.error("Error fetching lawyer by ID:", err);
    return null;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const res = await request(`admins/admin-profile`, "GET", undefined, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    if (!res || !res.payload) return null;

    return res;
  } catch (err) {
    console.error("Error fetching lawyer by ID:", err);
    return null;
  }
};

export const updateProfileService = async (data: LawyerProfileRequest) => {
  console.log("Updating profile with data:", data);
  try {
    const res = await request(`admins/update-profile`, "PUT", data, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (!res || !res.payload) return null;
    return res;
  } catch (err) {
    console.error("Error updating lawyer profile:", err);
    return null;
  }
};
