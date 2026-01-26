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
import toast from "react-hot-toast";

import Button from "../../../utils/button/Button";
import { BoxIcon } from "../../../icons";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

import { request } from "@/constants/api.tsx";


import { useEffect } from "react";
import { GetCourt } from "@/Service/CourtService.tsx";
import { Edit, Trash } from "iconsax-reactjs";
const ListCourt = () => {
  const navigate = useNavigate();
  const { courtList, page, totalPage, setPage, refetch } = GetCourt();

  // Ensure list is an array
  const routeForUpdate = (id: number) => {
    navigate(`/edit-court/${id}`);
  };

  function dateFormatter(iso: string) {
    return new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  useEffect(() => {
    refetch;
  }, []);
  async function handleDeleteService(id: number) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-black text-lg  gap-2">
          <p>Are you sure you want to delete Client id {id}?</p>

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-[16px] text-black bg-gray-300 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 text-[16px] bg-red-600 text-white rounded"
              onClick={async () => {
                toast.dismiss(t.id);

                const loadingId = toast.loading("Deleting service...");

                try {
                  const res = await request(
                    `services/${id}`,
                    "DELETE",
                    undefined,
                    undefined
                  );

                  toast.dismiss(loadingId);

                  if (res?.status === "ACCEPTED") {
                    toast.success(`Service ID ${id} deleted successfully`);
                  } else {
                    toast.error(res?.detail || "Delete failed");
                  }
                } catch (error) {
                  toast.dismiss(loadingId);
                  toast.error("Server error. Please try again.");
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      {
        // kit jea millisecond
        duration: Infinity, // stays until user clicks
      }
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard
          title="List Services"
          desc="A list of all services available in the system."
          headerActions={
            <>
              <Button
                size="md"
                variant="primary"
                startIcon={<AiOutlinePlus className="size-5" />}
                onClick={() => navigate("/add-court")}
              >
                Create Court
              </Button>
            </>
          }
          searchInput={
            <Input
              type="text"
              placeholder="Search by name location..."
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
              <span>Total row : {courtList?.length}</span>
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
            <div className="overflow-x-auto ">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b   bg-black   border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium whitespace-nowrap w-20 text-gray-500 text-center dark:text-gray-400"
                    >
                      Court Id
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium whitespace-nowrap w-40 text-gray-500 text-center dark:text-gray-400"
                    >
                      Court Name
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      Type
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      Location
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 m-3 whitespace-nowrap min-w-40 font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      <span>Contact Number</span>
                    </TableCell>

                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 bg-black font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {courtList.map((item) => (
                    <TableRow className="h-20" key={item.courtId}>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800   text-theme-sm dark:text-white/90">
                              {item.courtId ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm  dark:text-white/90">
                        {item.courtName ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.courtType ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.location ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.contactNumber ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {dateFormatter(item.createdAt) ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 whitespace-nowrap sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {dateFormatter(item.updatedAt) ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          {/* Update Button */}
                          <button
                            onClick={() => routeForUpdate(item.courtId)}
                            className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Edit size="24" color="#ffffff" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteService(item?.courtId)}
                            className="p-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash size="24" color="#ffffff" />
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

export default ListCourt;
