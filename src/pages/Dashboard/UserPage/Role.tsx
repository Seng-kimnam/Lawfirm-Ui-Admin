import ComponentCard from "../../../components/common/ComponentCard";
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
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import { deleteRole, getRoles, postRole, putRole } from "../../../Service/RoleService.tsx";
import { CustomModal } from "../../../utils/CustomModal.tsx";
import Label from "../../../components/form/Label.tsx";
import { Roles } from "../../../model/Roles.tsx";
const Role = () => {
  const { list, refetch } = getRoles();
  const [open, setOpen] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<Roles>({
    roleId: 0,
    roleName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  useEffect(() => {
    console.log("Service Types List:", list);
  }, [list, refetch]);
  const handleRefresh = () => {
    refetch();
  };
  const handleOk = async () => {
    if (newRole.roleName === "") {
      return;
    }
    if (newRole.roleId === 0) {
      await postRole(newRole);
    } else {
      await putRole(newRole);
    }
    setNewRole({
      roleId: 0,
      roleName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setOpen(false);
    refetch();
  };
   const handleUpdate = (item: Roles) => {
      setNewRole(item);
      setOpen(true);
    };
    
    const handleDelete = async (roleId : Number) => {
    console.log("Deleting role with ID:", roleId);
        try {
          const res = await deleteRole(roleId);
          console.log("Delete response:", res);
          refetch(); // refresh the list after deletion
        } catch (error) {
          console.error("Failed to delete role:", error);
          alert("An error occurred while deleting the role.");
        }
      };
    
  return (
    <div>
      <CustomModal
        open={open}
        title="Form Create Role"
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
              {newRole.roleId === 0 ? "Create" : "Update"}
            </Button>
          </>
        }
      >
        <div>
          <Label htmlFor="input">Role Name</Label>
          <Input
            type="text"
            placeholder="Enter role name"
            id="input"
            value={newRole.roleName}
            onChange={(e) => setNewRole({...newRole, roleName: e.target.value})}
          />
        </div>
      </CustomModal>
      <div className="space-y-6">
        <ComponentCard
          title="List Services"
          desc="A list of all services available in the system."
          headerActions={
            <>
              <Button
                size="sm"
                variant="outline"
                startIcon={<BoxIcon className="size-5" />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button size="sm" variant="primary" onClick={() => setOpen(true)}>
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
        >
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Role Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {list.map((item) => (
                    <TableRow key={item.roleId}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.roleId ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm  dark:text-white/90">
                        {item.expertiseId ?? "N/A"}
                      </TableCell> */}
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item.roleName ?? "N/A"}
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
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          {/* Update Button */}
                          <button
                            onClick={() => handleUpdate(item)}
                            className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Update
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.roleId)}
                            className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
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

export default Role;
