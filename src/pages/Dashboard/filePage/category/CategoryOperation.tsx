import { request } from "@/constants/api";
import { getCategoryWithPagination } from "@/constants/constants_url";
import { CategoryInterface, CategoryRequest } from "@/model/Category";

import { useEffect, useState } from "react";

export const CategoryOperation = () => {
  const [categories, setCategories] = useState<CategoryInterface[] | null>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(
        getCategoryWithPagination(page),
        "GET",
        undefined,
        undefined
      );

      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      //   setDocumentList(res.payload.content || []);
      //   setDocumentList(res?.payload);
      setCategories(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]); // refetch when page changes

  return { categories, page, setPage, totalPage, refetch: fetchData };
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

/// ------------------- config soon --------------------------
export const postCategory = async (req: CategoryRequest) => {
  try {
    const response = await request(
      "categories",
      "POST",
      req,
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      "application/json"
    );
    if (response.success) {
      return response;
    }
  } catch (error) {
    alert(Error);
  }
};

// // Update Service
// export const putService = async (req: ServiceItem) => {
//   try {
//     if (!req.serviceId) {
//       throw new Error("Service ID is required for update");
//     }
//     const response = await request(putServiceUrl + req.serviceId, "PUT", req, {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     });
//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error: any) {
//     alert(
//       error.response?.data?.message || error.message || "Something went wrong"
//     );
//   }
// };
