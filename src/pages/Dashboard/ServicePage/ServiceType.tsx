import ComponentCard from "../../../components/common/ComponentCard";
// import Badge from "../../../components/ui/badge/Badge";
import Input from "../../../utils/input/InputField.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Button from "../../../utils/button/Button";
import { BoxIcon } from "../../../icons";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import {
  deleteServiceTypes,
  GetServiceType,
} from "../../../Service/ServiceTypeService.tsx";
import { useState } from "react";
import { CustomModal } from "../../../utils/CustomModal.tsx";
import Label from "../../../components/form/Label.tsx";
import {
  postServiceType,
  putServiceType,
} from "../../../Service/ServiceTypeService.tsx";
import { ServiceType } from "../../../model/ServiceType.tsx";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
const ServiceTypes = () => {
  const [newServiceType, setNewServiceType] = useState<ServiceType>({
    expertiseId: 0,
    expertName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [open, setOpen] = useState<boolean>(false);
  const { list, page, totalPage, setPage, refetch } = GetServiceType();
  async function handleOk() {
    if (newServiceType.expertName === "") {
      return;
    }
    if (newServiceType.expertiseId === 0) {
      const res = await postServiceType(newServiceType);
      console.log("res ", res);
      if (res?.success) {
        toast.success("Service Type create successfully");
      }
    } else {
      const res = await putServiceType(newServiceType);
      if (res?.success) {
        toast.success("Service Type update successfully");
      }
    }
    setNewServiceType({
      expertiseId: 0,
      expertName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setOpen(false);
    refetch();
  }

  function handleUpdate(item: ServiceType) {
    setNewServiceType(item);
    setOpen(true);
  }
  function handleCreate() {
    setNewServiceType({
      expertiseId: 0,
      expertName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setOpen(true);
  }
  async function handleDeleteService(id: number) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-black text-lg  gap-2">
          <p>Are you sure you want to delete service type Id {id}?</p>

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
                  const res = await deleteServiceTypes(id);

                  toast.dismiss(loadingId);

                  if (res?.status === "ACCEPTED") {
                    toast.success(
                      `Service type with Id ${id} deleted successfully`
                    );
                    refetch();
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
      <CustomModal
        open={open}
        title="Form Service"
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        footer={
          <>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              size="sm"
              variant="primary"
              type="button"
              onClick={() => {
                handleOk();
                setOpen(false);
              }}
            >
              {newServiceType.expertiseId === 0 ? "Create" : "Update"}
            </Button>
          </>
        }
      >
        <div>
          <Label htmlFor="input">Service Name</Label>
          <Input
            type="text"
            placeholder="Enter service name"
            id="input"
            value={newServiceType.expertName}
            onChange={(e) =>
              setNewServiceType({
                ...newServiceType,
                expertName: e.target.value,
              })
            }
          />
        </div>
      </CustomModal>
      <div className="space-y-6">
        <ComponentCard
          title="List Services"
          desc="A list of all services available in the system."
          headerActions={
            <>
              <Button size="sm" variant="primary" onClick={handleCreate}>
                Create Service
              </Button>
            </>
          }
          searchInput={
            <Input
              type="text"
              placeholder="Search service type..."
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
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-lg text-gray-500   dark:text-gray-400"
                    >
                      Id
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500  text-lg dark:text-gray-400"
                    >
                      Service Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500   text-lg dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-lg  dark:text-gray-400"
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500   dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {list.map((item) => (
                    <TableRow key={item.expertiseId}>
                      <TableCell className="px-5 py-4 sm:px-6 ">
                        <div className="flex items-center justify-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.expertiseId ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      {/* <TableCell className="px-4 py-3 text-gray-500  text-theme-sm  dark:text-white/90">
                        {item.expertiseId ?? "N/A"}
                      </TableCell> */}
                      <TableCell className="px-5 py-4 sm:px-6 ">
                        <div className="flex items-center justify-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.expertName ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 ">
                        <div className="flex items-center justify-center gap-3">
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
                      <TableCell className="px-5 py-4 sm:px-6 ">
                        <div className="flex items-center  justify-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {new Date(
                                item.updatedAt ?? ""
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
                        <div className="flex justify-center items-center gap-3">
                          {/* Update Button */}
                          <button
                            onClick={() => handleUpdate(item)}
                            className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Edit size="24" color="#ffffff" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              handleDeleteService(item?.expertiseId)
                            }
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

export default ServiceTypes;
