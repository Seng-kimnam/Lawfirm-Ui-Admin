import { useEffect, useState } from "react";

import { registerUrl } from "../constants/constants_url";
import { request } from "../constants/api";
import { Lawyer, Lawyers } from "@/model/Lawyer";

export const GetLawyers = () => {
  const [list, setList] = useState<Lawyer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const fetchData = async () => {
    try {
      const res = await request("lawyers", "GET", undefined, undefined);

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
    const response = await request(registerUrl, "POST", data, {
      Authorization: `Bearer ${token}`,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    alert(Error);
  }
};

export const registerLawyerService = async (data: Lawyers) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("title", data.title);
  formData.append("roleId", String(data.roleId));
  formData.append("gender", data.gender);
  formData.append("email", data.email);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("password", data.password);
  formData.append("description", data.description);
  formData.append("lawyerStatus", data.lawyerStatus);

  data.expertiseIdList.forEach((id: number) =>
    formData.append("expertiseIdList", String(id))
  );

  formData.append("facebookLink", data.facebookLink ?? "");
  formData.append("tiktokLink", data.tiktokLink ?? "");
  formData.append("telegramLink", data.telegramLink ?? "");

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await request(
    "auths/register",
    "POST",
    formData,
    undefined,
    "multipart/form-data"
  );

  return response.data;
};
// Update Lawyer
// fetchLawyerById
export const fetchLawyerById = async (
  id: number | string
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
