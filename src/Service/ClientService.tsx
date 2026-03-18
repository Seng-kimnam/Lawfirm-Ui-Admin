import { putServiceUrl } from "../constants/constants_url";
import { ServiceItem } from "../model/Service";
import { request } from "../constants/api";
import { useCallback, useEffect, useState } from "react";
import { ClientInterface, ClientRequest } from "@/model/Client";
import { ClientDocumentInterface } from "@/model/Document";

export const GetClient = () => {
  const [clientList, setClientList] = useState<ClientInterface[]>([]);
  // const [expert , setExpert ] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const fetchData = async () => {
    try {
      const res = await request(
        "clients/without-pagination",
        "GET",
        undefined,
        undefined,
      );

      // console.log("res", res);
      if (!res || !res.payload) throw new Error("No data received");

      // map data from API
      setClientList(res?.payload || []);
      // setExpert(res.payload.content || []);
      setTotalPage(res.payload.totalPages || 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // refetch when page changes

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

export const searchClientByEmail = async (email: string) => {
  try {
    const res = await request(
      `clients/search-client-req?email=${email}&page=1&size=5&sortBy=clientId&ascending=true`,
      "GET",
      undefined,
      undefined,
      "application/json",
    );

    if (res.status) {
      console.log("Search API response:", res);
      return res;
    }
  } catch (err) {
    console.log("Error ", err);
  }
};
export const postService = async (req: ClientRequest) => {
  try {
    const response = await request("clients", "POST", req, {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    if (response.status === "CREATED") {
      return response.data;
    }
  } catch {
    alert("Failed to create client.");
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
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: string } } }).response
        ?.data?.message === "string"
        ? (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message
        : error instanceof Error
          ? error.message
          : "Something went wrong";

    alert(errorMessage);
  }
};

export const GetClientRequestDocument = () => {
  const [clientDocumentList, setClientDocumentList] = useState<
    ClientDocumentInterface[]
  >([]);
  const [page, setPage] = useState<number>(1); // backend uses page 0-based
  const [totalPage, setTotalPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  type DocumentCollectionResponse = {
    payload?:
      | ClientDocumentInterface[]
      | {
          totalPages?: number;
          content?: ClientDocumentInterface[];
        };
    data?:
      | ClientDocumentInterface[]
      | {
          totalPages?: number;
          content?: ClientDocumentInterface[];
        };
  };

  type ClientDocumentSearchItem = {
    id: string;
    clientId: number;
    clientName: string;
    name: string;
    fileName: string;
    fileUrl: string;
    fileSize: string;
    fileType: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  const groupSearchPayload = useCallback(
    (items: ClientDocumentSearchItem[]): ClientDocumentInterface[] => {
      const groupedDocuments = new Map<number, ClientDocumentInterface>();

      items.forEach((item) => {
        const normalizedClientId = Number(item.id);
        const existingClient = groupedDocuments.get(normalizedClientId);

        if (existingClient) {
          existingClient.documents.push({
            name: item.name || item.fileName || "Untitled document",
            fileUrl: item.fileUrl,
            fileSize: item.fileSize,
            fileType: item.fileType,
          });
          return;
        }

        groupedDocuments.set(normalizedClientId, {
          id: normalizedClientId,
          clientId: item.clientId,
          clientName: item.clientName,
          description: item.description || "",
          createdAt: item.createdAt || "",
          updatedAt: item.updatedAt || "",
          documents: [
            {
              name: item.name || item.fileName || "Untitled document",
              fileUrl: item.fileUrl,
              fileSize: item.fileSize,
              fileType: item.fileType,
            },
          ],
        });
      });

      return Array.from(groupedDocuments.values());
    },
    [],
  );

  const normalizeDocumentPayload = useCallback(
    (response: unknown): ClientDocumentInterface[] => {
      const normalizedResponse = response as DocumentCollectionResponse;
      const payload =
        normalizedResponse?.payload ?? normalizedResponse?.data ?? response;

      if (Array.isArray(payload)) {
        const isGroupedDocumentPayload = payload.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "documents" in item &&
            Array.isArray(item.documents),
        );

        if (isGroupedDocumentPayload) {
          return payload as ClientDocumentInterface[];
        }

        return groupSearchPayload(payload as ClientDocumentSearchItem[]);
      }

      if (
        typeof payload === "object" &&
        payload !== null &&
        "content" in payload &&
        Array.isArray(payload.content)
      ) {
        const isGroupedDocumentPayload = payload.content.every(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "documents" in item &&
            Array.isArray(item.documents),
        );

        if (isGroupedDocumentPayload) {
          return payload.content as ClientDocumentInterface[];
        }

        return groupSearchPayload(
          payload.content as ClientDocumentSearchItem[],
        );
      }

      return [];
    },
    [groupSearchPayload],
  );

  const fetchData = useCallback(
    async (searchKeyword = keyword) => {
      setIsLoading(true);

      try {
        const normalizedKeyword = searchKeyword.trim();
        const endpoint = normalizedKeyword
          ? "files/client-documents/search"
          : "files/client-documents/all";
        const params = normalizedKeyword
          ? { keyword: normalizedKeyword }
          : undefined;

        const res = (await request(
          endpoint,
          "GET",
          undefined,
          params,
        )) as DocumentCollectionResponse;

        console.log("Hello", res);
        const normalizedDocuments = normalizeDocumentPayload(res);
        const totalPages =
          (typeof res?.payload === "object" && !Array.isArray(res.payload)
            ? res.payload.totalPages
            : undefined) ??
          (typeof res?.data === "object" && !Array.isArray(res.data)
            ? res.data.totalPages
            : undefined) ??
          1;

        setClientDocumentList(normalizedDocuments);
        setTotalPage(totalPages);
        setPage(1);
      } catch (error) {
        console.error("Error fetching services:", error);
        setClientDocumentList([]);
        setTotalPage(1);
      } finally {
        setIsLoading(false);
      }
    },
    [keyword, normalizeDocumentPayload],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    clientDocumentList,
    page,
    setPage,
    totalPage,
    refetch: fetchData,
    keyword,
    setKeyword,
    isLoading,
  };
};
