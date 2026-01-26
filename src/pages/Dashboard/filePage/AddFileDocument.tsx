import PageMeta from "../../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";

import Label from "../../../components/form/Label.tsx";
import { useEffect, useState } from "react";

import { useDropzone } from "react-dropzone";
import Button from "../../../components/ui/button/Button.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { request } from "@/constants/api.tsx";

import { useNavigate, useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import EmbeddedPdfViewer from "@/utils/EmbeddedPdfViewer.tsx";
import toast from "react-hot-toast";

type DocumentFormData = {
  docId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  fileCover: File | null;
  fileUrl: File | null;
};
type Category = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentFormData;
};
const AddFileDocument = () => {
  const { id } = useParams();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUpdating, setIsUpdating] = useState<Boolean>(false);
  const [DocForUpdate, setDocForUpdate] = useState<DocumentFormData | null>(
    null,
  );
  const goBack = useNavigate();

  function handleCancelUpdate() {
    goBack("/list-file-doc");
  }

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<DocumentFormData>();

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await request(
          "categories/without-pagination",
          "GET",
          undefined,
          undefined,
        );
        // const
        setCategories(res?.payload);
      } catch (e) {
        console.error("ERROR ", e);
      }
    }

    fetchCategory();
  }, []);

  useEffect(() => {
    if (!categories.length || !id) return;

    async function fetchDocById() {
      try {
        const res = await request(`documents/${id}`, "GET");
        const doc = res.payload;

        const category = categories.find(
          (c) => c.categoryName === doc.categoryName,
        );

        setIsUpdating(true);
        setDocForUpdate(doc);

        reset({
          title: doc.title,
          categoryId: category?.categoryId,
          categoryName: category?.categoryName,
          fileCover: null, // files cannot be prefilled
          fileUrl: null,
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchDocById();
  }, [categories, id, reset]);

  // Dropzone for cover image

  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    isDragActive: isCoverDragActive,
  } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setCoverFile(acceptedFiles[0]);
        setValue("fileCover", acceptedFiles[0]);
      }
    },
  });

  // Dropzone for PDF file
  const {
    getRootProps: getPdfRootProps,
    getInputProps: getPdfInputProps,
    isDragActive: isPdfDragActive,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setPdfFile(acceptedFiles[0]);
        setValue("fileUrl", acceptedFiles[0]);
      }
    },
  });

  const removeCoverFile = () => {
    setCoverFile(null);
    setValue("fileCover", null);
  };

  const removePdfFile = () => {
    setPdfFile(null);
    setValue("fileUrl", null);
  };

  const onSubmit: SubmitHandler<DocumentFormData> = async (data) => {
    console.log("Form Data:", data);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("categoryId", data.categoryId.toString());

    if (data.fileCover) {
      const fd = new FormData();
      fd.append("file", data?.fileCover);

      const { payload } = await request(
        `files/upload-file`,
        "POST",
        fd,
        undefined,
        "multipart/form-data",
      );

      formData.append("fileCover", payload?.fileName);
    } else if (isUpdating && DocForUpdate?.fileCover) {
      formData.append("fileCover", DocForUpdate?.fileCover);
    }

    if (data.fileUrl) {
      const fd = new FormData();
      fd.append("file-pdf", data?.fileUrl);
      const category = categories.find((c) => c.categoryId === data.categoryId);
      const resPdfFile = await request(
        `files/upload-pdf?lawType=${category?.categoryName}`,
        "POST",
        fd,
        undefined,
        "multipart/form-data",
      );

      formData.append("fileUrl", resPdfFile?.objectName);
    } else if (isUpdating && DocForUpdate?.fileUrl) {
      formData.append("fileUrl", DocForUpdate?.fileUrl);
    }

    try {
      // Example API call
      const response = await request(
        isUpdating ? `documents/${id}` : "documents",
        isUpdating ? "PUT" : "POST",
        formData,
        undefined,
        "application/json",
      );

      if (response?.success) {
        toast.success(
          `${isUpdating ? "Update" : "Create"} new file document successfully. `,
        );
        handleCancelUpdate();
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Add new file document" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <ComponentCard title="Form Document">
            <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <input
                  // value={DocForUpdate?.title}
                  className="border-2 rounded-lg px-4 py-1 w-96"
                  type="text"
                  placeholder="Enter the title"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Category</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {categories.map(({ categoryId, categoryName }) => (
                            <SelectItem
                              key={categoryId}
                              value={categoryId.toString()}
                            >
                              {categoryName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </ComponentCard>

          {/* Cover Image Upload */}
          <ComponentCard title="Upload Cover Image">
            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
              <div
                {...getCoverRootProps()}
                className={`dropzone rounded-xl border-dashed p-7 lg:p-10 ${
                  isCoverDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <input {...getCoverInputProps()} />

                <div className="dz-message flex flex-col items-center m-0">
                  <div className="mb-5.5 flex justify-center">
                    <div className="flex h-17 w-17 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg
                        className="fill-current"
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                    {isCoverDragActive
                      ? "Drop Cover Image Here"
                      : "Drag & Drop Cover Image Here"}
                  </h4>

                  <span className="text-center mb-5 block w-full max-w-72.5 text-sm text-gray-700 dark:text-gray-400">
                    Drag and drop your PNG, JPG, WebP, SVG image here or browse
                  </span>

                  <span className="font-medium underline text-theme-sm text-brand-500">
                    Browse File
                  </span>
                </div>
              </div>
            </div>

            {!coverFile && DocForUpdate?.fileCover && (
              <div className="mt-4">
                <Label className="text-lg">
                  Current Cover Image (Click to get better preview)
                </Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      className="w-40 h-60 cursor-pointer"
                      src={`http://localhost:8080/api/v1/files/preview-file?fileName=${DocForUpdate?.fileCover}`}
                      alt={DocForUpdate?.fileCover?.toString()}
                    />
                  </DialogTrigger>
                  <DialogContent className="w-full z-999999  content-center justify-center max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw]">
                    <DialogHeader>
                      {/* <DialogTitle>{title}</DialogTitle> */}
                      <p className="text-center text-3xl underline  font-battambang tracking-wide">
                        {DocForUpdate?.title}
                      </p>
                      {/* <PdfViewer /> */}
                    </DialogHeader>
                    <img
                      className="h-[80vh] object-cover border-2 border-black "
                      src={`http://localhost:8080/api/v1/files/preview-file?fileName=${DocForUpdate?.fileCover}`}
                      alt={DocForUpdate?.fileCover?.toString()}
                    />
                    {/* Hello */}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {coverFile && (
              <div className="mt-4">
                <Label>Uploaded Cover Image</Label>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-brand-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {coverFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(coverFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoverFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </ComponentCard>

          {/* PDF File Upload */}
          <ComponentCard title="Upload PDF Document">
            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
              <div
                {...getPdfRootProps()}
                className={`dropzone rounded-xl border-dashed p-7 lg:p-10 ${
                  isPdfDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <input {...getPdfInputProps()} />

                <div className="dz-message flex flex-col items-center m-0">
                  <div className="mb-5.5 flex justify-center">
                    <div className="flex h-17 w-17 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg
                        className="fill-current"
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                    {isPdfDragActive ? "Drop PDF Here" : "Drag & Drop PDF Here"}
                  </h4>

                  <span className="text-center mb-5 block w-full max-w-72.5 text-sm text-gray-700 dark:text-gray-400">
                    Drag and drop your PDF document here or browse
                  </span>

                  <span className="font-medium underline text-theme-sm text-brand-500">
                    Browse File
                  </span>
                </div>
              </div>
            </div>

            {pdfFile && (
              <div className="mt-4">
                <Label>Uploaded PDF Document</Label>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {pdfFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(pdfFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removePdfFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </ComponentCard>
          {!pdfFile && DocForUpdate?.fileUrl && (
            <div>
              <Label className="text-lg ">
                Current PDF file (Click to get better preview)
              </Label>

              <Dialog>
                <DialogTrigger asChild>
                  <img
                    className="h-60 w-40  cursor-pointer"
                    src={`http://localhost:8080/api/v1/files/preview-file?fileName=${DocForUpdate?.fileCover}`}
                    alt={DocForUpdate?.fileCover?.toString()}
                  />
                </DialogTrigger>
                <DialogContent className="w-full max-w-[95vw] z-99999  md:max-w-[90vw] lg:max-w-[80vw]">
                  <DialogHeader>
                    {/* <DialogTitle>{title}</DialogTitle> */}
                    <p className=" font-battambang tracking-wide">
                      {DocForUpdate?.title}
                    </p>
                    {/* <PdfViewer /> */}
                  </DialogHeader>
                  <EmbeddedPdfViewer
                    docId={DocForUpdate?.docId}
                    fileUrl={`http://localhost:9000/lawfirm-bucket/${DocForUpdate?.fileUrl}`}
                    title={DocForUpdate?.title}
                  />
                  {/* Hello */}
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="space-y-6 justify-end flex gap-5">
            <div className="space-y-6">
              <Button
                onClick={handleCancelUpdate}
                type="button"
                size="md"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
            <div className="space-y-6">
              <Button type="submit" size="md" variant="primary">
                {!isUpdating ? "Create " : "Update "} Document
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFileDocument;
