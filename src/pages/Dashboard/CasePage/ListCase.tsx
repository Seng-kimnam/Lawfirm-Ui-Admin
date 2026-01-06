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
import { BiSearch } from "react-icons/bi";
import { GetCase } from "@/Service/CaseService.tsx";
import toast from "react-hot-toast";
import { request } from "@/constants/api.tsx";
import { BsArrowLeft, BsArrowRight, BsExclamation } from "react-icons/bs";
import { Edit, Trash } from "iconsax-reactjs";
const ListService = () => {
  const navigate = useNavigate();
  const { casesList, page, totalPage, setPage } = GetCase();
  // Ensure list is an array

  function goto(path: string) {
    navigate(path);
  }
  function formatReadableStatus(status: string) {
    switch (status) {
      case "IN_PROGRESSING":
        return "In Progress";
      case "DONE":
        return "Done";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  }
  async function handleDeleteCase(id: number) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-black text-lg  gap-2">
          <p>Are you sure you want to delete Case id {id}?</p>

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

                const loadingId = toast.loading("Deleting case...");

                try {
                  const res = await request(
                    `cases/${id}`,
                    "DELETE",
                    undefined,
                    undefined
                  );

                  toast.dismiss(loadingId);

                  if (res?.status === "ACCEPTED") {
                    toast.success(`Case ID ${id} deleted successfully`);
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
                onClick={() => navigate("/add-case")}
              >
                Create Case
              </Button>
            </>
          }
          searchInput={
            <Input
              type="text"
              placeholder="Search service..."
              icon={<BiSearch className="w-5 h-5" />}
              id="input"
            />
          }
          footer={
            <div className="flex justify-between items-center">
              <span>
                Showing page {page} of {totalPage}
              </span>
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
            <div className=" max-w-[1130px] overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-mediumbg bg-black text-gray-500 text-start whitespace-nowrap dark:text-gray-400"
                    >
                      Case Id
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-mediumbg bg-black text-gray-500 text-start whitespace-nowrap dark:text-gray-400"
                    >
                      Client Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-mediumbg bg-black text-gray-500 text-start whitespace-nowrap dark:text-gray-400"
                    >
                      Court Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium bg-black text-gray-500 text-start whitespace-nowrap dark:text-gray-400"
                    >
                      Title
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 w-80 font-medium  bg-black text-gray-500 text-start whitespace-nowrap dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium bg-black text-gray-500 text-center whitespace-nowrap min-w-44 dark:text-gray-400"
                    >
                      Start Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium bg-black text-gray-500 text-start whitespace-nowrap min-w-44 dark:text-gray-400"
                    >
                      End Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium bg-black text-gray-500 text-start whitespace-nowrap min-w-44 dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium  bg-black text-gray-500 text-start whitespace-nowrap min-w-44 dark:text-gray-400"
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 bg-black font-medium text-gray-500 text-center dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {casesList.map((item) => (
                    <TableRow key={item.caseId}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.caseId ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.client.clientName ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm  dark:text-white/90">
                        {item.court.courtName ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.title ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="whitespace-nowrap w-60  font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {/* {(item.status ?? "N/A") + " "} */}
                              {formatReadableStatus(item.status ?? "N/A")}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {new Date(
                                item.startDate ?? ""
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {new Date(item.endDate ?? "").toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {new Date(
                                item.createdAt ?? ""
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {new Date(item.updatedAt ?? "").toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          {/* Update Button */}
                          <button
                            onClick={() => goto(`/edit-case/${item.caseId}`)}
                            className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Edit size="24" color="#ffffff" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteCase(item?.caseId)}
                            className="p-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash size="24" color="#ffffff" />
                          </button>
                          <button
                            onClick={() => goto(`/case-detail-info/${item.caseId}` )}
                            className="p-2 text-sm rounded-md bg-green-700 text-white hover:bg-green-500"
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

export default ListService;
