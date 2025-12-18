import { useEffect, useState } from "react";
import { request } from "../constants/api";
import { Service } from "../model/Service";
export const useGetService = () => {
  const [fullList, setFullList] = useState([]); // all data from backend
  const [list, setList] = useState<Service[]>([]);;         // paginated 10 items
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const res = await request("services", "GET", {});
      setFullList(res.list || []); // backend: { list: [...], total: 12 }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // paginate automatically when page changes
  const paginate = () => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setList(fullList.slice(start, end));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    paginate();
  }, [page, fullList]);

  const totalPage = Math.ceil(fullList.length / itemsPerPage);

  return { list, page, setPage, totalPage };
};
