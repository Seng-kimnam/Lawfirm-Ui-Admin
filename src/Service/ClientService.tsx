import {
  getClientList,
  getServiceUrl,
  postServiceUrl,
  putServiceUrl,
} from "../constants/constants_url";
import { ServiceItem } from "../model/Service";
import { request } from "../constants/api";
import { useEffect, useState } from "react";
import { ClientInterface, ClientRequest } from "@/model/Client";

export const GetClient = () => {
  const [clientList, setClientList] = useState<ClientInterface[]>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(
        getClientList(page),
        "GET",
        undefined,
        undefined
      );

      // console.log("res", res);
      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      setClientList(res?.payload?.content || []);
      // setExpert(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  console.log("f ", clientList);

  useEffect(() => {
    fetchData();
  }, [page]); // refetch when page changes

  return { clientList, page, setPage, totalPage, refetch: fetchData };
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
export const postService = async (req: ClientRequest) => {
  try {
    const response = await request("clients", "POST", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.status === "CREATED") {
      return response.data;
    }
  } catch (error) {
    alert(Error);
  }
};

// Update Service
export const putService = async (req: ServiceItem) => {
  try {
    if (!req.serviceId) {
      throw new Error("Service ID is required for update");
    }
    const response = await request(putServiceUrl + req.serviceId, "PUT", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
