
import { useState, useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { BsExclamation, BsPrinter } from "react-icons/bs";

import Button from "@/utils/button/Button";
import Input from "@/utils/input/InputField";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { TableCell, TableHeader } from "@/components/ui/table/index";
import { AppointmentInterface } from "@/model/Appointment";
import { Edit, Trash } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { request } from "@/constants/api";
import { useNavigate } from "react-router";

interface AppointmentReportProps {
  appointmentList: Array<AppointmentInterface>;
  parseDate: (date: string) => string | null;
  parseTime: (time: string) => string | null;
}

type FilterField =
  | "status"
  | "meetingType"
  | "dateRange"
  | "location"
  | "clientName";

interface FilterState {
  status: string;
  meetingType: string;
  dateRange: "all" | "today" | "week" | "month";
  location: string;
  clientName: string;
}

const AppointmentReport = ({
  appointmentList,
  parseDate,
  parseTime,
}: AppointmentReportProps) => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    meetingType: "",
    dateRange: "all",
    location: "",
    clientName: "",
  });

  const getDateRange = (rangeType: string) => {
    const today = new Date();
    const startDate = new Date();

    switch (rangeType) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        return { start: startDate, end: today };
      case "week":
        startDate.setDate(today.getDate() - 7);
        return { start: startDate, end: today };
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        return { start: startDate, end: today };
      default:
        return { start: new Date(2000, 0, 1), end: today };
    }
  };

  const goto = useNavigate();


  function changeStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-orange-500 dark:bg-orange-600";
      case "finished":
        return "bg-green-500 dark:bg-green-600";
      case "confirmed":
        return "bg-blue-500 dark:bg-blue-600";
      case "cancelled":
        return "bg-red-500 dark:bg-red-600";
      default:
        return "bg-gray-700 dark:bg-gray-600";
    }
  }


  async function handleDeleteCase(id: number) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-gray-900 dark:text-white text-lg gap-2 bg-white dark:bg-gray-900 p-4 rounded-lg">
          <p>Are you sure you want to delete Task id {id}?</p>

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-[16px] text-gray-900 dark:text-white bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 text-[16px] bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded"
              onClick={async () => {
                toast.dismiss(t.id);

                const loadingId = toast.loading("Deleting task...");

                try {
                  const res = await request(
                    `appointments/${id}`,
                    "DELETE",
                    undefined,
                    undefined,
                  );

                  toast.dismiss(loadingId);

                  if (res?.status === "ACCEPTED") {
                    toast.success(`Task ID ${id} deleted successfully`);
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

  const filteredData = useMemo(() => {
    return appointmentList.filter((item) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        item.appointmentId?.toString().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower) ||
        item.purpose?.toLowerCase().includes(searchLower) ||
        item.task?.lawyer?.fullName?.toLowerCase().includes(searchLower);

      const matchesStatus = !filters.status || item.status === filters.status;

      const matchesMeetingType =
        !filters.meetingType || item.meetingType === filters.meetingType;

      const matchesLocation =
        !filters.location ||
        item.location?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesClientName =
        !filters.clientName ||
        item.task?.lawyer?.fullName
          ?.toLowerCase()
          .includes(filters.clientName.toLowerCase());

      const appointmentDate = new Date(item.appointmentDate);
      const { start, end } = getDateRange(filters.dateRange);
      const matchesDateRange =
        appointmentDate >= start && appointmentDate <= end;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMeetingType &&
        matchesLocation &&
        matchesClientName &&
        matchesDateRange
      );
    });
  }, [searchText, filters, appointmentList]);

  const changeStatusToNormalText = (status: string, textType?: string) => {
    if (textType === "MeetingType") {
      switch (status) {
        case "IN_PERSON":
          return "In Person";
        case "ONLINE":
          return "Online";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "PENDING":
          return "Pending";
        case "CONFIRMED":
          return "Confirmed";
        case "FINISHED":
          return "Finished";
        case "CANCELLED":
          return "Cancelled";
        default:
          return status;
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=800,width=1200");
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
            .header h1 { font-size: 24px; margin-bottom: 10px; }
            .header p { font-size: 14px; color: #666; }
            .filters-info { margin-bottom: 20px; font-size: 13px; background: #f5f5f5; padding: 10px; border-radius: 4px; }
            .filters-info strong { display: block; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #004B87; color: white; padding: 12px; text-align: left; font-weight: bold; font-size: 12px; }
            td { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 12px; }
            tr:nth-child(even) { background: #f9f9f9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .summary { margin-bottom: 20px; padding: 15px; background: #e8f4f8; border-left: 4px solid #004B87; }
            .summary-item { display: inline-block; margin-right: 30px; }
            .summary-item strong { display: block; color: #004B87; font-size: 16px; }
            .status-pending { background: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 3px; }
            .status-confirmed { background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 3px; }
            .status-finished { background: #d1ecf1; color: #0c5460; padding: 4px 8px; border-radius: 3px; }
            .status-cancelled { background: #f8d7da; color: #721c24; padding: 4px 8px; border-radius: 3px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Appointment Report</h1>
            <p>Generated on ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${new Date().toLocaleTimeString("en-US")}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <strong>${filteredData.length}</strong>
              <span>Total Appointments</span>
            </div>
            <div class="summary-item">
              <strong>${filteredData.filter((a) => a.status === "CONFIRMED").length}</strong>
              <span>Confirmed</span>
            </div>
            <div class="summary-item">
              <strong>${filteredData.filter((a) => a.status === "PENDING").length}</strong>
              <span>Pending</span>
            </div>
            <div class="summary-item">
              <strong>${filteredData.filter((a) => a.status === "FINISHED").length}</strong>
              <span>Finished</span>
            </div>
            <div class="summary-item">
              <strong>${filteredData.filter((a) => a.status === "CANCELLED").length}</strong>
              <span>Cancelled</span>
            </div>
          </div>

          ${Object.values(filters).some((v) => v && v !== "all")
        ? `<div class="filters-info">
              <strong>Applied Filters:</strong>
              ${filters.status ? `Status: ${changeStatusToNormalText(filters.status, "AppointmentStatus")}<br>` : ""}
              ${filters.meetingType ? `Meeting Type: ${changeStatusToNormalText(filters.meetingType, "MeetingType")}<br>` : ""}
              ${filters.location ? `Location: ${filters.location}<br>` : ""}
              ${filters.clientName ? `Client Name: ${filters.clientName}<br>` : ""}
              ${filters.dateRange !== "all" ? `Date Range: ${filters.dateRange}<br>` : ""}
            </div>`
        : ""
      }

          <table>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Client Name</th>
                <th>Meeting Type</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
        .map(
          (item) => `
                <tr>
                  <td>${item.appointmentId ?? "N/A"}</td>
                  <td>${parseDate(item.appointmentDate) ?? "N/A"}</td>
                  <td>${parseTime(item.appointmentTime) ?? "N/A"}</td>
                  <td>${item.location ?? "N/A"}</td>
                  <td>${item.task?.lawyer?.fullName ?? "N/A"}</td>
                  <td>${changeStatusToNormalText(item.meetingType, "MeetingType") ?? "N/A"}</td>
                  <td>${item.purpose ?? "N/A"}</td>
                  <td><span class="status-${item.status.toLowerCase()}">${changeStatusToNormalText(item.status, "AppointmentStatus") ?? "N/A"}</span></td>
                  <td>${new Date(item.createdAt ?? "").toLocaleDateString("en-US")}</td>
                </tr>
              `,
        )
        .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>This is an automatically generated report. For further assistance, please contact support.</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} All Rights Reserved.</p>
          </div>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleFilterChange = (field: FilterField, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      meetingType: "",
      dateRange: "all",
      location: "",
      clientName: "",
    });
    setSearchText("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Appointment Report & Export
          </h2>
          <Button
            size="md"
            variant="primary"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <BsPrinter className="w-4 h-4" />
            Print Report
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by ID, location, purpose, or client name..."
            icon={<BiSearch className="w-5 h-5" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="" className="dark:bg-gray-800 dark:text-white">All Status</option>
              <option value="PENDING" className="dark:bg-gray-800 dark:text-white">Pending</option>
              <option value="CONFIRMED" className="dark:bg-gray-800 dark:text-white">Confirmed</option>
              <option value="FINISHED" className="dark:bg-gray-800 dark:text-white">Finished</option>
              <option value="CANCELLED" className="dark:bg-gray-800 dark:text-white">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meeting Type
            </label>
            <select
              value={filters.meetingType}
              onChange={(e) =>
                handleFilterChange("meetingType", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="" className="dark:bg-gray-800 dark:text-white">All Types</option>
              <option value="IN_PERSON" className="dark:bg-gray-800 dark:text-white">In Person</option>
              <option value="ONLINE" className="dark:bg-gray-800 dark:text-white">Online</option>
              <option value="HYBRID" className="dark:bg-gray-800 dark:text-white">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all" className="dark:bg-gray-800 dark:text-white">All Time</option>
              <option value="today" className="dark:bg-gray-800 dark:text-white">Today</option>
              <option value="week" className="dark:bg-gray-800 dark:text-white">Last 7 Days</option>
              <option value="month" className="dark:bg-gray-800 dark:text-white">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Filter location"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Client Name
            </label>
            <input
              type="text"
              placeholder="Filter client"
              value={filters.clientName}
              onChange={(e) => handleFilterChange("clientName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="mb-6">
          <Button size="sm" variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>
              Showing {filteredData.length} of {appointmentList.length}{" "}
              appointments
            </strong>
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {filteredData.length > 0 && (
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Appointment ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium  text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Location
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Client Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Meeting Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Purpose
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody className="divide-y divide-gray-100 text-center dark:divide-white/[0.05]">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.appointmentId}>
                      <TableCell className="px-5 py-4">
                        {item.appointmentId ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap  text-gray-500 dark:text-white/90">
                        {parseDate(item.appointmentDate) ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 min-w-20  text-gray-500 dark:text-white/90">
                        {parseTime(item.appointmentTime) ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap  text-gray-500 dark:text-white/90">
                        {item.location ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 dark:text-white/90">
                        {item.task?.lawyer?.fullName ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {changeStatusToNormalText(
                          item.meetingType,
                          "MeetingType",
                        ) ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        {item.purpose ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full ${changeStatusColor(item.status)} text-sm font-medium  text-gray-800 dark:text-gray-200`}>
                          {changeStatusToNormalText(
                            item.status,
                            "AppointmentStatus",
                          ) ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        {new Date(item.createdAt ?? "").toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 ">
                        <div className="flex items-center gap-3">
                          {/* Update Button */}
                          <button
                            onClick={() =>
                              goto(`/edit-appointment/${item.appointmentId}`)
                            }
                            className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Edit size="24" color="#ffffff" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              handleDeleteCase(item?.appointmentId)
                            }
                            className="p-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash size="24" color="#ffffff" />
                          </button>
                          <button
                            onClick={() =>
                              goto(
                                `/appointment-detail/${item.appointmentId}`,
                              )
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
                    <TableCell colSpan={9} className="py-20 text-center">
                      <p className="text-lg text-gray-500 dark:text-gray-400">
                        No appointments match your filters
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AppointmentReport;
