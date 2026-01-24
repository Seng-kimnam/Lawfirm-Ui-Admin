import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../utils/input/InputField.tsx";
import { useNavigate } from "react-router-dom";

import Button from "../../../utils/button/Button";

import { BsArrowLeft, BsArrowRight, BsExclamation } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";

import { Edit, Trash } from "iconsax-reactjs";
import toast from "react-hot-toast";
import { request } from "@/constants/api.tsx";
import { GetDefaultAppointmentList } from "@/Service/AppointmentService.tsx";
import PageMeta from "@/components/common/PageMeta.tsx";
import { Table, TableBody, TableRow } from "@/components/ui/table.tsx";
import { TableCell, TableHeader } from "@/components/ui/table/index.tsx";
import AppointmentReport from "./report/AppointmentReport.tsx";
const AppointmentList = () => {
  const navigate = useNavigate();
  const {
    appointmentList,
    page,
    totalPage,
    setPage,
    refetch,
    parseDate,
    parseTime,
  } = GetDefaultAppointmentList();

  const goto = useNavigate();

  function chooseStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "blue";
      case "completed":
        return "green";
      case "canceled":
        return "red";
      default:
        return "gray";
    }
  }

  function changeStatusToNormalText(status: string, text?: string) {
    if (text === "MeetingType") {
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
      }
    }
  }
  async function handleDeleteCase(id: number) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-black text-lg  gap-2">
          <p>Are you sure you want to delete Task id {id}?</p>

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
  // Ensure list is an array
  return (
    <div>
      <PageMeta
        title="Appointment List"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard
          title="List Of appointments"
          desc="A list of all appointments available in the system."
          headerActions={
            <>
              <Button
                size="md"
                variant="primary"
                onClick={() => navigate("/add-appointment")}
              >
                Create Appointment
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
              <span>Total Appointment : {appointmentList?.length} </span>

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
            <div className="max-w-[1130px] overflow-x-auto">
              <Table>
                <AppointmentReport
                  appointmentList={appointmentList}
                  parseDate={parseDate}
                  parseTime={parseTime}
                />
                {/* Table Header */}
                {appointmentList.length > 0 && (
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Appointment Id
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Time
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Location
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Client Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Meeting Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Purpose
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap dark:text-gray-400"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap min-w-40 dark:text-gray-400"
                      >
                        Created At
                      </TableCell>

                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  whitespace-nowrap min-w-40 dark:text-gray-400"
                      >
                        Updated At
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500  text-theme-xs dark:text-gray-400"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                )}
                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 text-center dark:divide-white/[0.05]">
                  {appointmentList.length > 0 ? (
                    appointmentList.map((item) => (
                      <TableRow key={item.appointmentId}>
                        <TableCell className="px-5 py-4 sm:px-6 ">
                          {item.appointmentId ?? "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500   whitespace-nowrap  dark:text-white/90">
                          {parseDate(item.appointmentDate) ?? "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500    dark:text-white/90">
                          {parseTime(item.appointmentTime) ?? "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500    dark:text-white/90">
                          {item.location ?? "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500    dark:text-white/90">
                          {item.task.lawyer.fullName ?? "N/A"}
                        </TableCell>

                        <TableCell className="px-5 py-4 sm:px-6 ">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium  text-gray-800  dark:text-white/90">
                                {changeStatusToNormalText(
                                  item.meetingType,
                                  "MeetingType",
                                ) ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell className="px-4 py-3 text-gray-500   dark:text-white/90">
                        <Badge
                          size="sm"
                          color={
                            item.status === "active"
                              ? "success"
                              : item.status === "pending"
                              ? "warning"
                              : "error"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell> */}
                        <TableCell className="px-5 py-4 sm:px-6 ">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800  dark:text-white/90">
                                {item.purpose ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 ">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 w-20  dark:text-white/90">
                                {changeStatusToNormalText(
                                  item.status,
                                  "AppointmentStatus",
                                ) ?? "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 whitespace-nowrap sm:px-6 ">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800  dark:text-white/90">
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
                        <TableCell className="px-5 py-4 sm:px-6 ">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium whitespace-nowrap w-40 text-gray-800  dark:text-white/90">
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
                    <div className="py-20 text-3xl text-red-400">
                      {" "}
                      No appointment list found.{" "}
                    </div>
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

export default AppointmentList;
