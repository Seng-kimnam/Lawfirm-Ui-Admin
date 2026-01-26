import ComponentCard from "../../../components/common/ComponentCard";
// import Badge from "../../../components/ui/badge/Badge";

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

import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

import { request } from "@/constants/api.tsx";

import { DocumentOperation } from "./DocumentOperation.tsx";
import EmbeddedPdfViewer from "@/utils/EmbeddedPdfViewer.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Edit, Trash } from "iconsax-reactjs";

const ListFileDocument = () => {
  const navigate = useNavigate();
  const { documentList, page, totalPage, setPage } = DocumentOperation();
  // Ensure list is an array
  const handleUpdateDoc = (id: number) => {
    navigate(`/edit-file-doc/${id}`);
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
  async function handleDeleteDocument(id: number) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-black text-lg  gap-2">
          <p>Are you sure you want to delete service ID {id}?</p>

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
                    `documents/${id}`,
                    "DELETE",
                    undefined,
                    undefined,
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
      },
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
                onClick={() => navigate("/add-file-doc")}
              >
                Create new document
              </Button>
            </>
          }
          searchInput={
            <Input
              type="text"
              placeholder="Search service..."
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
          <div className="overflow-hidden max-w-[1120px] rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b dark:text-center  border-gray-100  dark:border-white/50">
                  <TableRow className="dark:text-center">
                    <TableCell
                      // isHeader
                      className="px-5 py-3 w-28 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Document Id
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Title
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      File Cover
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Document PDF
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Category Name
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Created At
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      // isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-white"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                  {documentList?.map((item) => (
                    <TableRow key={item.docId}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              {item.docId ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              {item?.title ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <img
                                  className="h-20 w-28"
                                  src={`http://localhost:8080/api/v1/files/preview-file?fileName=${item.fileCover}`}
                                  alt={item.fileCover}
                                />
                              </DialogTrigger>
                              <DialogContent className="w-full z-999999  content-center justify-center max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
                                <DialogHeader>
                                  {/* <DialogTitle>{title}</DialogTitle> */}
                                  <p className="text-center text-3xl underline  font-battambang tracking-wide">
                                    {item.title}
                                  </p>
                                  {/* <PdfViewer /> */}
                                </DialogHeader>
                                <img
                                  className="h-[80vh] object-cover border-2 border-black "
                                  src={`http://localhost:8080/api/v1/files/preview-file?fileName=${item.fileCover}`}
                                  alt={item.fileCover}
                                />
                                {/* Hello */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <img
                                  className="h-20 w-28"
                                  src={`http://localhost:8080/api/v1/files/preview-file?fileName${item.fileCover}`}
                                  alt={item.fileCover}
                                />
                              </DialogTrigger>
                              <DialogContent className="w-full max-w-[95vw] z-99999  md:max-w-[90vw] lg:max-w-[80vw]">
                                <DialogHeader>
                                  {/* <DialogTitle>{title}</DialogTitle> */}
                                  <p className=" font-battambang tracking-wide">
                                    {item.title}
                                  </p>
                                  {/* <PdfViewer /> */}
                                </DialogHeader>
                                <EmbeddedPdfViewer
                                  docId={item.docId}
                                  fileUrl={`http://localhost:9000/lawfirm-bucket/${item.fileUrl}`}
                                  title={item.title}
                                />
                                {/* Hello */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              {item?.categoryName ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              {dateFormatter(item?.createdAt) ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              {dateFormatter(item.updatedAt) ?? "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          {/* Update Button */}
                          <button
                            onClick={() => handleUpdateDoc(item.docId)}
                            className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Edit size="24" color="#ffffff" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteDocument(item?.docId)}
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

export default ListFileDocument;
