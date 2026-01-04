import {
  getClientList,
  getServiceUrl,
  getTaskList,
  postServiceUrl,
  putServiceUrl,
} from "../constants/constants_url";
import { ServiceItem } from "../model/Service";
import { request } from "../constants/api";
import { useEffect, useState } from "react";
import { ClientInterface, ClientRequest } from "@/model/Client";
import { TaskInterface, taskRequest } from "@/model/Task";

export const GetTask = () => {
  const [taskList, setTaskList] = useState<TaskInterface[]>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(getTaskList(page), "GET", undefined, undefined);

      // console.log("res", res);
      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      setTaskList(res?.payload?.content || []);
      // setExpert(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // refetch when page changes

  return { taskList, page, setPage, totalPage, refetch: fetchData };
};

// // fetchServiceById
// export const fetchServiceById = async (id: number | string): Promise<ServiceItem | null> => {
//   try {
//     const res = await request(getServiceByIdUrl(id), "GET");

//     if (!res || !res.payload) return null;

//     return res.payload;
//   } catch (err) {
//     console.error("Error fetching service by ID:", err);
//     return null;
//   }
// };

// Fetch Add Service
export const postTask = async (req: taskRequest) => {
  try {
    const response = await request("tasks", "POST", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.success) {
      return response;
    }
  } catch (error) {
    alert(Error);
  }
};

// Update Service
export const putTask = async (req: taskRequest, id: number) => {
  try {
    if (!id) {
      throw new Error("Task ID is required for update");
    }
    const response = await request(`tasks/${id}`, "PUT", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.success) {
      return response;
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
