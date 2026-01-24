import {
  deleteServiceTypeUrl,
  getServiceTypeUrl,
  postServiceTypeUrl,
  putServiceTypeUrl,
} from "../constants/constants_url";
import { ServiceType } from "../model/ServiceType";
import { request } from "../constants/api";
import { useEffect, useState } from "react";

export const GetServiceType = () => {
  const [list, setList] = useState<ServiceType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(
        getServiceTypeUrl(page),
        "GET",
        undefined,
        undefined,
      );

      if (!res || !res.payload) throw new Error("No data received");
      // map data from API
      setList(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return { list, page, setPage, totalPage, refetch: fetchData };
};

// Fetch Add Roles
export const postServiceType = async (req: ServiceType) => {
  try {
    const response = await request(postServiceTypeUrl, "POST", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.success) {
      return response;
    }
  } catch (error) {
    alert(Error);
  }
};

// Update ServiceType
export const putServiceType = async (req: ServiceType) => {
  try {
    if (!req.expertiseId) {
      throw new Error("ServiceType ID is required for update");
    }
    const response = await request(
      putServiceTypeUrl + req.expertiseId,
      "PUT",
      req,
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    );
    if (response.success) {
      return response;
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message || error.message || "Something went wrong",
    );
  }
};

// Delete Roles
export const deleteServiceTypes = async (expertiseId: Number) => {
  try {
    if (!expertiseId) {
      throw new Error("ServiceType ID is required for delete");
    }
    const response = await request(
      deleteServiceTypeUrl + expertiseId,
      "DELETE",
      undefined,
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    );

    if (response.success) {
      console.log("Delete successful", response);
      return response;
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message || error.message || "Something went wrong",
    );
  }
};

export const GetExpertiseList = () => {
  const [list, setList] = useState<ServiceType[]>([]);

  const fetchData = async () => {
    try {
      const res = await request(
        "expertises/without-pagination",
        "GET",
        undefined,
        undefined,
      );

      if (!res || !res.payload) throw new Error("No data received");
      // map data from API
      setList(res.payload || []);
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { list, refetch: fetchData };
};
