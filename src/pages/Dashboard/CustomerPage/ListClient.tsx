import ComponentCard from "../../../components/common/ComponentCard";
// import Badge from "../../../components/ui/badge/Badge";
import { GetService } from "../../../Service/ListServiceService";
import Input from "../../../utils/input/InputField.tsx";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import toast from "react-hot-toast";

import Button from "../../../utils/button/Button";
import { BoxIcon } from "../../../icons";
import { BsArrowLeft, BsArrowRight, BsExclamation } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

import { request } from "@/constants/api.tsx";
import { GetClient } from "@/Service/ClientService.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useEffect } from "react";
import { Edit, Trash } from "iconsax-reactjs";
import { GetClientRequest } from "@/Service/ClientRequestService.tsx";
const ListClient = () => {
  const navigate = useNavigate();
  // const { clientList, page, totalPage, setPage, refetch } = GetClient();
  const { clientRequestList, page, setPage, totalPage, refetch } =
    GetClientRequest();

  function routeForDetail(email: string) {
    navigate(`/client-request-info?email=${email}`);
  }

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard
          title="List Clients"
          desc="A list of all clients available in the system."
          searchInput={
            <Input
              type="text"
              placeholder="Search client by name..."
              icon={<BiSearch className="w-5 h-5" />}
              // className="px-6 py-5 flex items-center justify-between border-t border-gray-100 dark:border-gray-800"
              id="input"
            />
          }
          footer={
            <div className="flex justify-between items-center">
              <span>
                Showing page {page} of {totalPage}
              </span>
              <span>Total Clients : {clientRequestList?.length} </span>
              <div className="flex gap-2">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <BsArrowLeft className=" font-bold" />
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
                  <BsArrowRight className=" font-bold" />
                </Button>
              </div>
            </div>
          }
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-[1130px] overflow-x-auto ">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b  text-center  bg-black   border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-xl text-gray-500 text-center dark:text-gray-400"
                    >
                      Client ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-xl text-gray-500 text-center dark:text-gray-400"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-xl text-center dark:text-gray-400"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-xl text-center dark:text-gray-400"
                    >
                      Total Request
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 bg-black font-medium text-xl text-gray-500 text-center dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {clientRequestList.map((item, idx) => (
                    <TableRow className="h-20" key={item.email}>
                      <TableCell className="px-4  py-3 text-gray-500 text-center   dark:text-white/90">
                        {idx + 1 }
                      </TableCell>
                      <TableCell className="px-4  py-3 text-gray-500 text-center   dark:text-white/90">
                        {item.clientName ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <span className="block font-medium text-gray-800 text-center  dark:text-white/90">
                          {item.email ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <span className="block font-medium text-gray-800 text-center  dark:text-white/90">
                          {item.requestCount ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 ">
                        <div className="flex  justify-center items-center gap-3">
                          <button
                            onClick={() => routeForDetail(item?.email)}
                            className="p-2 text-sm rounded-3xl bg-green-500 text-white hover:bg-green-600"
                          >
                            <BsExclamation size="24" color="#ffffff" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
