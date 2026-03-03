import PageMeta from "../../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import { useEffect, useState, useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Calendar2 } from "iconsax-reactjs";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CaseRequest, CaseStatus } from "@/model/Case.tsx";
import { GetCaseNoPagination } from "@/Service/CaseService.tsx";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { GetLawyers } from "@/Service/UserService.tsx";

import { getTaskById, postTask, putTask } from "@/Service/TaskService.tsx";
import { TaskInterface, TaskRequest } from "@/model/Task.tsx";

const AddTask = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Received task ID:", id);
  const { list } = GetLawyers();
  const { casesList } = GetCaseNoPagination();
  const goto = useNavigate();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [openStart, setOpenStart] = useState<boolean>(false);
  const [openEnd, setOpenEnd] = useState<boolean>(false);
  const [monthStart, setMonthStart] = useState(new Date());
  const [monthEnd, setMonthEnd] = useState(new Date());
  const [taskDetails, setTaskDetails] = useState<TaskInterface | null>(null);

  const {
    watch,
    formState: { errors },
    reset,
    register,
    setValue,
    handleSubmit,
  } = useForm<TaskRequest>({
    defaultValues: {
      caseId: 0,
      lawyerId: 0,
      title: "",
      description: "string",
      status: "UNDER_PROGRESS",
      taskPriority: "LOW",
      startedDate: "",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (id) {
      // If there's an ID, we are in edit mode, so fetch the task details
      const fetchTaskDetails = async () => {
        try {
          const taskData = await getTaskById(id);
          if (taskData) {
            setTaskDetails(taskData);
            const existingTask: TaskRequest = {
              caseId: taskData.legalCase.caseId,
              lawyerId: taskData.lawyer.appUserId,
              title: taskData.title,
              description: taskData.description,
              status: taskData.status,
              taskPriority: taskData.priority,
              startedDate: taskData.createdAt,
              dueDate: taskData.dueDate,
            };

            // Fill the form with existing task values in edit mode
            reset(existingTask);

            // Set date pickers to the existing dates
            if (taskData.createdAt) {
              const createdAtDate = new Date(taskData.createdAt);
              setStartDate(createdAtDate);
              setMonthStart(createdAtDate);
            }
            if (taskData.dueDate) {
              const dueDate = new Date(taskData.dueDate);
              setEndDate(dueDate);
              setMonthEnd(dueDate);
            }
          } else {
            toast.error("Task not found");
            goto("/list-task");
          }
        } catch (error) {
          console.error("Error fetching task details:", error);
          toast.error("Failed to load task details");
          goto("/list-task");
        }
      };
      fetchTaskDetails();
    } else {
      setTaskDetails(null);
      resetFormUI();
    }
  }, [id, goto, reset]);

  // Use watch with all fields at once to reduce re-renders
  const { caseId, lawyerId, status } = watch();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 2099 - currentYear + 1 },
    (_, i) => currentYear + i,
  );
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const caseStatus: CaseStatus[] = [
    {
      value: "UNDER_PROGRESS",
      label: "Under Progress",
    },

    {
      value: "DONE",
      label: "Done",
    },
  ];

  function handleStartYearChange(year: string) {
    const newDate = new Date(monthStart);
    newDate.setFullYear(Number.parseInt(year));
    setMonthStart(newDate);
  }

  function handleStartMonthChange(monthIndex: string) {
    const newDate = new Date(monthStart);
    newDate.setMonth(Number.parseInt(monthIndex));
    setMonthStart(newDate);
  }
  function handleEndYearChange(year: string) {
    const newDate = new Date(monthEnd);
    newDate.setFullYear(Number.parseInt(year));
    setMonthEnd(newDate);
  }

  function handleEndMonthChange(monthIndex: string) {
    const newDate = new Date(monthEnd);
    newDate.setMonth(Number.parseInt(monthIndex));
    setMonthEnd(newDate);
  }

  const resetFormUI = useCallback(() => {
    // react-hook-form reset
    reset({
      title: "",
      description: "",
      status: "UNDER_PROGRESS",
      caseId: 0,
      lawyerId: 0,
      startedDate: "",
      dueDate: "",
      taskPriority: "LOW",
    });

    // date states
    setStartDate(undefined);
    setEndDate(undefined);

    // calendar month states
    const today = new Date();
    setMonthStart(today);
    setMonthEnd(today);

    // close popovers
    setOpenStart(false);
    setOpenEnd(false);
  }, [reset]);

  async function handleOperation(data: TaskRequest) {
    try {
      const response = id
        ? await putTask(data, Number(id))
        : await postTask(data);

      // This block only runs for 2xx statuses
      if (response?.success) {
        // Success: show success message, reset form, etc.

        toast.success(`${id ? "Task updated" : "Task created"} successfully`);
        resetFormUI();
        goto("/list-task");
      }

      // handle other successful but non-ideal cases here if needed
    } catch (error: any) {
      // This catches 4xx/5xx responses (including 409)
      if (error.response) {
        // Server responded with error status + body
        const errorData = error.response.data;
        const status = error.response.status;

        console.error("Error response:", errorData); // Should show your { success: false, message: ... }

        if (status === 409) {
          // Specific handling for duplicate case
          toast.error(errorData.message || "This case already exists!");
          // Or use toast, set form error, etc.
        } else {
          // Other errors (e.g., 400, 500)
          toast.error(errorData.message || "An error occurred");
        }
      } else if (error.request) {
        // No response received (network issue, etc.)
        console.error("No response:", error.request);
        toast.error("Network error – please try again");
      } else {
        // Other errors
        console.error("Error:", error.message);
        toast.error("Something went wrong");
      }
    }
  }

  function handleGoBack() {
    goto("/list-task");
    resetFormUI();
  }

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb
        pageTitle={id ? `Edit Task number ${id}` : "Add New Task"}
      />
      <form onSubmit={handleSubmit(handleOperation)}>
        <div className="space-y-6">
          <ComponentCard title="Form task ">
            <div className="space-y-6 w-full grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label>Lawyer Name</Label>

                <Select
                  value={
                    lawyerId
                      ? lawyerId.toString()
                      : taskDetails?.lawyer?.appUserId?.toString() || ""
                  }
                  onValueChange={(value) => {
                    setValue("lawyerId", Number(value), {
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Lawyer List </SelectLabel>
                      {taskDetails?.lawyer &&
                        !list?.some(
                          (lawyer) =>
                            lawyer.appUserId === taskDetails.lawyer.appUserId,
                        ) && (
                          <SelectItem
                            value={taskDetails.lawyer.appUserId.toString()}
                          >
                            {taskDetails.lawyer.appUserId}.{" "}
                            {taskDetails.lawyer.fullName}
                          </SelectItem>
                        )}

                      {list?.map((l) => (
                        <SelectItem
                          key={l.appUserId}
                          value={l.appUserId.toString()}
                        >
                          {l.appUserId}. {l.fullName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("lawyerId", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label>Case Name</Label>

                <Select
                  value={
                    caseId
                      ? caseId.toString()
                      : taskDetails?.legalCase?.caseId?.toString() || ""
                  }
                  onValueChange={(value) =>
                    setValue("caseId", Number(value), { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Case list </SelectLabel>
                      {taskDetails?.legalCase &&
                        !casesList?.some(
                          (legalCase) =>
                            legalCase.caseId === taskDetails.legalCase.caseId,
                        ) && (
                          <SelectItem
                            value={taskDetails.legalCase.caseId.toString()}
                          >
                            {taskDetails.legalCase.caseId}.{" "}
                            {taskDetails.legalCase.title}
                          </SelectItem>
                        )}

                      {casesList?.map((c) => (
                        <SelectItem key={c.caseId} value={c.caseId.toString()}>
                          {c.caseId}. {c.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("caseId", { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label htmlFor="input">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setValue("status", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel> task status </SelectLabel>

                      {caseStatus?.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("status")} />
              </div>
              <div>
                <Label htmlFor="input">Priority</Label>
                <Select
                  value={taskDetails?.priority || "LOW"}
                  onValueChange={(value) =>
                    setValue("taskPriority", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel> task priority </SelectLabel>

                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("taskPriority")} />
              </div>
              <div>
                <Label htmlFor="input">Title</Label>
                <input
                  className="border-2 rounded-lg px-4 bg-gray-800 py-2 w-full  focus:transition-all duration-150 delay-75"
                  type="text"
                  placeholder="Enter the title"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                />
              </div>
              <div>
                <Label htmlFor="input">Start Date</Label>

                <Popover open={openStart} onOpenChange={setOpenStart}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-12 border-2 font-normal px-4 bg-gray-800 hover:bg-gray-700 text-left justify-start"
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-2 text-gray-400 flex-shrink-0">
                          <Calendar2 className="size-5" color="#bcc5cd" />
                        </div>
                        <span
                          className={`text-base ${
                            startDate ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {startDate
                            ? format(startDate, "PPP")
                            : "Choose your start date"}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <div className="p-3 border-b">
                      <div className="flex gap-2">
                        <Select
                          value={monthStart.getMonth().toString()}
                          onValueChange={handleStartMonthChange}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto z-[99999]">
                            {months.map((monthName, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {monthName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={monthStart.getFullYear().toString()}
                          onValueChange={handleStartYearChange}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto z-[99999]">
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(selectedDate) => {
                        if (!selectedDate) return;

                        setStartDate(selectedDate);
                        setValue("startedDate", selectedDate.toISOString(), {
                          shouldValidate: true,
                        });

                        // Clear end date if it's before the new start date
                        if (endDate && selectedDate > endDate) {
                          setEndDate(undefined);
                          setValue("dueDate", "", { shouldValidate: true });
                        }

                        setOpenStart(false);
                      }}
                      month={monthStart}
                      onMonthChange={setMonthStart}
                      disabled={(date) => date < new Date(1900, 0, 1)}
                      defaultMonth={monthStart}
                    />
                  </PopoverContent>
                </Popover>
                <input type="hidden" {...register("startedDate")} />
              </div>
              <div>
                <Label>Due Date</Label>

                <Popover open={openEnd} onOpenChange={setOpenEnd}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-12 border-2 font-normal px-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-left justify-start"
                      disabled={!startDate}
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-2 text-gray-400 flex-shrink-0">
                          <Calendar2 className="size-5" color="#bcc5cd" />
                        </div>
                        <span
                          className={`text-base ${
                            endDate ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {endDate
                            ? format(endDate, "PPP")
                            : startDate
                              ? "Choose your end date"
                              : "Select start date first"}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <div className="p-3 border-b">
                      <div className="flex gap-2">
                        <Select
                          value={monthEnd.getMonth().toString()}
                          onValueChange={handleEndMonthChange}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto z-[99999]">
                            {months.map((monthName, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {monthName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={monthEnd.getFullYear().toString()}
                          onValueChange={handleEndYearChange}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto z-[99999]">
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(selectedDate) => {
                        if (!selectedDate) return;

                        setEndDate(selectedDate);
                        setValue("dueDate", selectedDate.toISOString(), {
                          shouldValidate: true,
                        });
                        setOpenEnd(false);
                      }}
                      month={monthEnd}
                      onMonthChange={setMonthEnd}
                      disabled={(date) => {
                        // Disable dates before start date
                        if (startDate && date < startDate) {
                          return true;
                        }
                        // Disable dates after today or before 1900
                        return date < new Date(1900, 0, 1);
                      }}
                      defaultMonth={monthEnd}
                    />
                  </PopoverContent>
                </Popover>
                <input type="hidden" {...register("dueDate")} />
              </div>
            </div>
            <div className="max-w-full">
              <Label htmlFor="input" className="text-xl">
                Description
              </Label>
              <textarea
                className="border-2  rounded-lg p-4 bg-gray-800  w-full  focus:transition-all duration-150 delay-75"
                placeholder="Describe the case"
                id="title"
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </div>
          </ComponentCard>

          <div className="space-y-6 justify-end flex gap-5">
            <div className="space-y-6">
              <Button type="button" onClick={handleGoBack}>
                Cancel
              </Button>
            </div>
            <div className="space-y-6">
              <Button type="submit">
                {id ? "Update Task" : "Create New Task"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddTask;
