import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../utils/input/InputField.tsx";
import { useNavigate } from "react-router-dom";

import Button from "../../../utils/button/Button";

import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";


import { GetDefaultAppointmentList } from "@/Service/AppointmentService.tsx";
import PageMeta from "@/components/common/PageMeta.tsx";
import { Table } from "@/components/ui/table.tsx";

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


              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default AppointmentList;
