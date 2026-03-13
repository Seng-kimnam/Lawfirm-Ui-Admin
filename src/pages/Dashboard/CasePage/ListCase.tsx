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
import {
  BsArrowLeft,
  BsArrowRight,
  BsExclamation,
  BsPrinter,
} from "react-icons/bs";
import { Edit, Trash } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import PageMeta from "@/components/common/PageMeta.tsx";
import { CaseInterface } from "@/model/Case";
const ListService = () => {
  const navigate = useNavigate();
  const { casesList, page, totalPage, setPage } = GetCase();
  const [dateFilterType, setDateFilterType] = useState<
    "all" | "day" | "month" | "year"
  >("all");
  const [filterDay, setFilterDay] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [apiFilteredList, setApiFilteredList] = useState<CaseInterface[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
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
  useEffect(() => {
    setApiFilteredList(casesList);
  }, [casesList]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (dateFilterType === "all") {
        setApiFilteredList(casesList);
        return;
      }

      let endpoint = "";

      if (dateFilterType === "day") {
        if (!filterDay) {
          setApiFilteredList(casesList);
          return;
        }
        const [year, month, day] = filterDay.split("-").map(Number);
        if (!year || !month || !day) {
          setApiFilteredList(casesList);
          return;
        }
        endpoint = `cases/filter-by-day?year=${year}&month=${month}&day=${day}`;
      }

      if (dateFilterType === "month") {
        if (!filterMonth) {
          setApiFilteredList(casesList);
          return;
        }
        const [year, month] = filterMonth.split("-").map(Number);
        if (!year || !month) {
          setApiFilteredList(casesList);
          return;
        }
        endpoint = `cases/filter-by-month?year=${year}&month=${month}`;
      }

      if (dateFilterType === "year") {
        if (!filterYear) {
          setApiFilteredList(casesList);
          return;
        }
        const year = Number(filterYear);
        if (!year) {
          setApiFilteredList(casesList);
          return;
        }
        endpoint = `cases/filter-by-year?year=${year}`;
      }

      if (!endpoint) return;

      setIsFiltering(true);
      try {
        const res = await request(endpoint, "GET", undefined, undefined);
        const list = Array.isArray(res?.payload)
          ? res.payload
          : Array.isArray(res?.payload?.content)
            ? res.payload.content
            : [];
        setApiFilteredList(list);
      } catch (error) {
        toast.error("Failed to filter cases");
        setApiFilteredList(casesList);
      } finally {
        setIsFiltering(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [casesList, dateFilterType, filterDay, filterMonth, filterYear]);

  const getFilterLabel = () => {
    if (dateFilterType === "day") {
      return filterDay ? `Day: ${filterDay}` : "Day: All";
    }
    if (dateFilterType === "month") {
      return filterMonth ? `Month: ${filterMonth}` : "Month: All";
    }
    if (dateFilterType === "year") {
      return filterYear ? `Year: ${filterYear}` : "Year: All";
    }
    return "All Dates";
  };

  const handlePrintPdf = () => {
    const printWindow = window.open("", "", "height=800,width=1200");
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups to print the report.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Case Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { margin-bottom: 24px; border-bottom: 2px solid #000; padding-bottom: 12px; }
            .header h1 { font-size: 24px; margin-bottom: 6px; }
            .header p { font-size: 13px; color: #666; }
            .filters { margin-bottom: 16px; font-size: 13px; background: #f5f5f5; padding: 10px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #004B87; color: white; padding: 10px; text-align: left; font-weight: bold; font-size: 12px; }
            td { padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 12px; }
            tr:nth-child(even) { background: #f9f9f9; }
            .footer { margin-top: 20px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Case Report</h1>
            <p>Generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })} at ${new Date().toLocaleTimeString("en-US")}</p>
          </div>

          <div class="filters">
            <strong>Filter:</strong> ${getFilterLabel()}
          </div>

          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Client Name</th>
                <th>Court Name</th>
                <th>Title</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              ${
                apiFilteredList.length > 0
                  ? apiFilteredList
                      .map(
                        (item) => `
                <tr>
                  <td>${item.caseId ?? "N/A"}</td>
                  <td>${item.client?.clientName ?? "N/A"}</td>
                  <td>${item.court?.courtName ?? "N/A"}</td>
                  <td>${item.title ?? "N/A"}</td>
                  <td>${formatReadableStatus(item.status ?? "N/A")}</td>
                  <td>${new Date(item.startDate ?? "").toLocaleDateString("en-US")}</td>
                  <td>${new Date(item.endDate ?? "").toLocaleDateString("en-US")}</td>
                  <td>${new Date(item.createdAt ?? "").toLocaleDateString("en-US")}</td>
                  <td>${new Date(item.updatedAt ?? "").toLocaleDateString("en-US")}</td>
                </tr>
              `,
                      )
                      .join("")
                  : `<tr><td colspan="9" style="text-align:center; padding: 20px;">No cases match the selected date filter</td></tr>`
              }
            </tbody>
          </table>

          <div class="footer">
            <p>Total cases: ${apiFilteredList.length}</p>
            <p style="margin-top: 6px;">© ${new Date().getFullYear()} All Rights Reserved.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

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
                    undefined,
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
      },
    );
  }
  return (
    <div>
      <div className="space-y-6">
        <PageMeta
          title="Case List"
          description="A list of all cases available in the system."
        />
        <ComponentCard
          title="List Cases"
          desc="A list of all cases available in the system."
          headerActions={
            <>
              <Button
                size="md"
                variant="primary"
                onClick={() => navigate("/add-case")}
              >
                Create Case
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={handlePrintPdf}
                className="ml-2 flex items-center gap-2"
                disabled={apiFilteredList.length === 0}
              >
                <BsPrinter className="w-4 h-4" />
                Print PDF
              </Button>
            </>
          }
          searchInput={
            <Input
              type="text"
              placeholder="Search case..."
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
          <div className="mb-4 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter By
                  </label>
                  <select
                    value={dateFilterType}
                    onChange={(e) =>
                      setDateFilterType(
                        e.target.value as "all" | "day" | "month" | "year",
                      )
                    }
                    className="w-full md:w-40 px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="all">All</option>
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>

                {dateFilterType === "day" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Day
                    </label>
                    <input
                      type="date"
                      value={filterDay}
                      onChange={(e) => setFilterDay(e.target.value)}
                      className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                )}

                {dateFilterType === "month" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Month
                    </label>
                    <input
                      type="month"
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                )}

                {dateFilterType === "year" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max="2200"
                      placeholder="YYYY"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full md:w-32 px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDateFilterType("all");
                  setFilterDay("");
                  setFilterMonth("");
                  setFilterYear("");
                }}
              >
                Reset Filter
              </Button>
            </div>
            {isFiltering && (
              <p className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                Applying date filter...
              </p>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className=" max-w-[1130px] overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start whitespace-nowrap dark:text-gray-300"
                    >
                      Case Id
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start whitespace-nowrap dark:text-gray-300"
                    >
                      Client Name
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start   dark:text-gray-300 w-60"
                    >
                      Court Name
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start whitespace-nowrap dark:text-gray-300"
                    >
                      Title
                    </TableCell>

                    <TableCell
                      // isHeader
                      className="px-5 py-3 w-80 text-gray-700 text-start whitespace-nowrap dark:text-gray-300"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-center whitespace-nowrap min-w-44 dark:text-gray-300"
                    >
                      Start Date
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start whitespace-nowrap min-w-44 dark:text-gray-300"
                    >
                      End Date
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start whitespace-nowrap min-w-44 dark:text-gray-300"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-start whitespace-nowrap min-w-44 dark:text-gray-300"
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 text-gray-700 text-center dark:text-gray-300"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {apiFilteredList.length > 0 ? (
                    apiFilteredList.map((item) => (
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
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm  dark:text-white/90 break-words w-[200px] max-w-[200px] whitespace-normal ">
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
                                item.startDate ?? "",
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
                                },
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
                                item.createdAt ?? "",
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
                              {new Date(
                                item.updatedAt ?? "",
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
                            onClick={() =>
                              goto(`/case-detail-info/${item.caseId}`)
                            }
                            className="p-2 text-sm rounded-md bg-green-700 text-white hover:bg-green-500"
                          >
                            <BsExclamation size="24" color="#ffffff" />
                          </button>
                        </div>
                      </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="py-16 text-center">
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                          No cases match the selected date filter
                        </p>
                      </TableCell>
                    </TableRow>
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

export default ListService;
