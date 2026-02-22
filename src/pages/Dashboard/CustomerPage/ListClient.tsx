import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../utils/input/InputField.tsx";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import Button from "../../../utils/button/Button";
import { BsArrowLeft, BsArrowRight, BsExclamation } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";

import { GetClientRequest } from "@/Service/ClientRequestService.tsx";
import { useEffect, useState } from "react";
import { searchClientByEmail } from "@/Service/ClientService.tsx";

const ListClient = () => {
  const navigate = useNavigate();

  const { clientRequestList, page, setPage, totalPage, refetch } =
    GetClientRequest();

  const [keyword, setKeyword] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  function routeForDetail(email: string) {
    navigate(`/client-request-info?email=${email}`);
  }

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!keyword.trim()) {
        setIsSearching(false);
        setSearchResult([]);
        refetch(); // Load full list again
        return;
      }

      try {
        setIsSearching(true);
        const data = await searchClientByEmail(keyword.trim());
        console
        // If backend returns Page object
        setSearchResult(data?.payload?.content ?? []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(delay);
  }, [keyword]);


  const dataToRender = isSearching ? searchResult : clientRequestList;

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard
          title="List Clients"
          desc="A list of all clients available in the system."
          searchInput={
            <Input
              type="text"
              placeholder="Search client by email..."
              icon={<BiSearch className="w-5 h-5" />}
              value={keyword}
              onChange={(e: any) => setKeyword(e.target.value)}
            />
          }
          footer={
            !isSearching && (
              <div className="flex justify-between items-center">
                <span>
                  Showing page {page} of {totalPage}
                </span>
                <span>Total Clients : {clientRequestList?.length}</span>
                <div className="flex gap-2">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <BsArrowLeft />
                  </Button>

                  <div className="flex items-center gap-1 flex-wrap">
                    {Array.from({ length: totalPage }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={i + 1 === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    disabled={page === totalPage}
                    onClick={() => setPage(page + 1)}
                  >
                    <BsArrowRight />
                  </Button>
                </div>
              </div>
            )
          }
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-[1130px] overflow-x-auto">
              <Table>
                <TableHeader className="border-b text-center bg-black border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell className="px-5 py-3 text-xl text-center">
                      Client ID
                    </TableCell>
                    <TableCell className="px-5 py-3 text-xl text-center">
                      Name
                    </TableCell>
                    <TableCell className="px-5 py-3 text-xl text-center">
                      Email
                    </TableCell>
                    <TableCell className="px-5 py-3 text-xl text-center">
                      Total Request
                    </TableCell>
                    <TableCell className="px-5 py-3 text-xl text-center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {dataToRender?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataToRender.map((item: any, idx: number) => (
                      <TableRow className="h-20" key={item.email}>
                        <TableCell className="text-center">{idx + 1}</TableCell>
                        <TableCell className="text-center">
                          {item.clientName ?? "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.email ?? "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.requestCount ?? "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => routeForDetail(item?.email)}
                              className="p-2 rounded-3xl bg-green-500 text-white hover:bg-green-600"
                            >
                              <BsExclamation size={20} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default ListClient;
