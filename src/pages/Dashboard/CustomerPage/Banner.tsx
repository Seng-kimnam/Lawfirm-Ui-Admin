import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Edit, Trash } from "iconsax-reactjs";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/utils/button/Button";
import { request } from "@/constants/api";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import PageMeta from "@/components/common/PageMeta";

const filePreviewUrl =
  "http://localhost:8080/api/v1/files/preview-file?fileName=";

const Banner = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<"add" | "edit">("add");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetBanner, setTargetBanner] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalBanner = useMemo(() => banners.length, [banners]);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await request("files/banner-list", "GET", undefined, undefined);
      if (!res || !Array.isArray(res.payload)) {
        throw new Error("No data received");
      }
      setBanners(res.payload);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBanners();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setSelectedPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedFile]);

  const openAddModal = () => {
    setUploadMode("add");
    setTargetBanner(null);
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const openEditModal = (path: string) => {
    setUploadMode("edit");
    setTargetBanner(path);
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setTargetBanner(null);
    setSelectedFile(null);
    setIsUploadModalOpen(false);
  };

  const handleChooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const uploadBannerFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await request(
      "files/upload-banner",
      "POST",
      formData as unknown as object,
      undefined,
      "multipart/form-data",
    );

    const fileName = res?.payload?.fileName;
    if (res.success) {
      toast.success("New Banner uploaded successfully");
    }
    if (!fileName) {
      throw new Error(res?.message || "Upload banner failed");
    }
    return fileName;
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile) {
      toast.error("Please choose a file to upload");
      return;
    }

    if (uploadMode === "edit" && !targetBanner) return;

    try {
      setIsSubmitting(true);
      const uploadedFileName = await uploadBannerFile(selectedFile);

      if (uploadMode === "add") {
        setBanners((prev) => [uploadedFileName, ...prev]);
      } else {
        setBanners((prev) =>
          prev.map((item) => (item === targetBanner ? uploadedFileName : item)),
        );
      }

      closeUploadModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleDeleteBanner(path: string) {
    toast(
      (t) => (
        <div className="flex flex-col font-extrabold text-gray-900 dark:text-white text-lg gap-2 bg-white dark:bg-gray-900 p-4 rounded-lg">
          <p>Are you sure you want this banner name {path}?</p>

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-[16px] text-gray-900 dark:text-white bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Keep it
            </button>

            <button
              className="px-3 py-1 text-[16px] bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded"
              onClick={async () => {
                toast.dismiss(t.id);
                const previousBanners = [...banners];
                setBanners((prev) => prev.filter((item) => item !== path));

                const loadingId = toast.loading("Deleting banner...");

                try {
                  const res = await request(
                    `files/delete-banner?bannerName=${path}`,
                    "DELETE",
                    undefined,
                    undefined,
                  );

                  toast.dismiss(loadingId);

                  if (res?.status === "OK") {
                    toast.success(`Banner  ${path} deleted successfully`);
                    await fetchBanners();
                  } else {
                    setBanners(previousBanners);
                    toast.error(res?.detail || "Delete failed");
                  }
                } catch (error) {
                  toast.dismiss(loadingId);
                  setBanners(previousBanners);
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
    <div className="space-y-6">
      <PageMeta
        description="The place where manage banner in client page"
        title="Banner Management"
      />
      <ComponentCard
        title="Banner List"
        desc="Manage all banners with image upload for add and edit."
        headerActions={
          <Button type="button" size="sm" onClick={openAddModal}>
            Add New Banner
          </Button>
        }
        footer={<div>Total Banner: {totalBanner}</div>}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-[1130px] overflow-x-auto">
            <Table>
              <TableHeader className="border-b text-center bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell className="px-5 py-3 text-xl text-center text-gray-700 dark:text-gray-300">
                    No
                  </TableCell>
                  <TableCell className="px-5 py-3 text-xl text-center text-gray-700 dark:text-gray-300">
                    Preview
                  </TableCell>
                  <TableCell className="px-5 py-3 text-xl text-center text-gray-700 dark:text-gray-300">
                    Banner Path
                  </TableCell>
                  <TableCell className="px-5 py-3 text-xl text-center text-gray-700 dark:text-gray-300">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="text-center py-6">Loading...</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                ) : banners.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-6">No data</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                ) : (
                  banners.map((path, idx) => (
                    <TableRow className="h-28" key={path}>
                      <TableCell className="text-center">{idx + 1}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <img
                                  className="h-20 w-28"
                                  src={`${filePreviewUrl}${encodeURIComponent(path)}`}
                                  // alt={item.fileCover}
                                  title="Click to get good preview"
                                />
                              </DialogTrigger>
                              <DialogContent className="w-full z-999999  content-center justify-center max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
                                <img
                                  className="h-[80vh] object-cover border-2 border-black "
                                  src={`${filePreviewUrl}${encodeURIComponent(path)}`}

                                  // src={`http://localhost:8080/api/v1/files/preview-file?fileName=${item.fileCover}`}
                                  // alt={item.fileCover}
                                />
                                {/* Hello */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {path}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center gap-3">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => openEditModal(path)}
                            className="!rounded-full !px-3 !py-2"
                          >
                            <Edit size="18" color="#ffffff" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleDeleteBanner(path)}
                            className="!rounded-full !px-3 !py-2 !bg-red-500 hover:!bg-red-600"
                          >
                            <Trash size="18" color="#ffffff" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {uploadMode === "add" ? "Add New Banner" : "Edit Banner"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {uploadMode === "add"
                ? "Upload an image to create a new banner."
                : "Upload a new image to replace this banner."}
            </p>

            {uploadMode === "edit" && targetBanner && (
              <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Current Banner
                </p>
                <img
                  src={`${filePreviewUrl}${encodeURIComponent(targetBanner)}`}
                  alt={targetBanner}
                  className="h-28 w-full rounded-md object-cover"
                />
              </div>
            )}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChooseFile}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-white hover:file:bg-brand-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {selectedPreviewUrl && (
              <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  New Preview
                </p>
                <img
                  src={selectedPreviewUrl}
                  alt="new banner preview"
                  className="h-28 w-full rounded-md object-cover"
                />
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeUploadModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitUpload}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Uploading..."
                  : uploadMode === "add"
                    ? "Upload & Add"
                    : "Upload & Replace"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
