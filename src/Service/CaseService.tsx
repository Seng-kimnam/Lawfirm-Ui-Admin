import {
  getCaseList,
} from "../constants/constants_url";
import { request } from "../constants/api";
import { useEffect, useState } from "react";

import { CaseInterface, CaseRequest } from "@/model/Case";

export const GetCase = () => {
  const [casesList, setCaseList] = useState<CaseInterface[]>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(getCaseList(page), "GET", undefined, undefined);

      // console.log("res", res);
      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      setCaseList(res?.payload?.content || []);
      // setExpert(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // refetch when page changes

  return { casesList, page, setPage, totalPage, refetch: fetchData };
};

export const GetCaseNoPagination = () => {
  const [casesList, setCaseList] = useState<CaseInterface[]>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  // const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(
        "cases/no-pagination",
        "GET",
        undefined,
        undefined,
      );

      // console.log("res", res);
      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      setCaseList(res?.payload || []);
      // setExpert(res.payload.content || []);
      // setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching case:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // refetch when page changes

  return { casesList , page, setPage, refetch: fetchData };
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
export const postCaseService = async (req: CaseRequest) => {
  const response = await request("cases", "POST", req, {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // console.log("service response:", response);
  return response; // Always return the response (even if success: false)
};

// Update Service
export const putCaseService = async (req: CaseRequest, id: number) => {
  try {
    if (!id) {
      throw new Error("Case ID is required for update");
    }
    const response = await request("/cases/" + id, "PUT", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    alert(
      error.response?.data?.message || error.message || "Something went wrong",
    );
  }
};
