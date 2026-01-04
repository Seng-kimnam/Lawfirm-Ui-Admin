import {
  getClientList,
  getCourtList,
  getServiceUrl,
  postServiceUrl,
  putServiceUrl,
} from "../constants/constants_url";
import { ServiceItem } from "../model/Service";
import { request } from "../constants/api";
import { useEffect, useState } from "react";
import { ClientInterface, ClientRequest } from "@/model/Client";
import { CourtInterface, CourtRequest } from "@/model/Court";

export const GetCourt = () => {
  const [courtList, setCourtList] = useState<CourtInterface[]>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(
        getCourtList(page),
        "GET",
        undefined,
        undefined
      );

      // console.log("res", res);
      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      setCourtList(res?.payload?.content || []);
      // setExpert(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // refetch when page changes

  return { courtList, page, setPage, totalPage, refetch: fetchData };
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
export const postNewCourtService = async (req: CourtRequest) => {
  try {
    const response = await request("courts", "POST", req, {
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
export const putCourtService = async (req: CourtRequest, id: number) => {
  try {
    if (!id) {
      throw new Error("Court Id is required for update");
    }
    const response = await request(`courts/${id}`, "PUT", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.status === "ACCEPTED") {
      return response;
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
