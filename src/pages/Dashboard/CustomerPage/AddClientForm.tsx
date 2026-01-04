import PageMeta from "../../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Input from "../../../utils/input/InputField.tsx";
import Label from "../../../components/form/Label.tsx";
import { useEffect, useState } from "react";
import TextArea from "../../../utils/input/TextArea.tsx";
import { useDropzone } from "react-dropzone";
import Button from "../../../components/ui/button/Button.tsx";
import PhoneInput from "../../../components/form/group-input/PhoneInput.tsx";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { statusList } from "@/enum/ClientStatus.ts";
import { ClientInterface, ClientRequest } from "@/model/Client.tsx";
import { request } from "@/constants/api.tsx";
// import { request } from "../../../constants/api.tsx";
const AddClientForm = () => {
  const { id } = useParams();
  const [clientImage, setClientImage] = useState<File | null>(null);
  const [specificClient, setSpecificClient] = useState<ClientRequest>();

  const {
    control,
    setValue,
    formState: { errors },
    register,
    reset,
  } = useForm();

  const backTo = useNavigate();

  function handleGoBack() {
    backTo("/list-client");
  }

  useEffect(() => {
    async function fetchClientById() {
      try {
        const res = await request(`clients/${id}`, "GET");
        const client = res.payload;
        setSpecificClient(client);
        reset({
          clientName: client.clientName,
          email: client.email,
          status: client.status,
          phoneNumber: client.phoneNumber,
          address: client.address,
          complaint: client.complaint,
          clientImage: null,
        });
      } catch (e) {
        console.error("Error ", e);
      }
    }
    fetchClientById();
  }, [id]);

  console.log("c ", specificClient);
  const removeClientImage = () => {
    setClientImage(null);
    setValue("fileCover", null);
  };
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
        setClientImage(acceptedFiles[0]);
        setValue("fileCover", acceptedFiles[0]);
      }
    },
  });
  return (
    <div>
      <PageMeta
        title="Update Client"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Client Form" />
      <div className="space-y-6">
        <ComponentCard title="Update Client">
          <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label htmlFor="input">Client Name</Label>
              <input
                // value={DocForUpdate?.title}
                className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                type="text"
                placeholder="+855 12 345 678"
                id="title"
                {...register("clientName", { required: "Title is required" })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <input
                // value={DocForUpdate?.title}
                className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                type="email"
                placeholder="+855 12 345 678"
                id="title"
                {...register("email", { required: "Title is required" })}
              />
            </div>
          </div>
          <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <input
                // value={DocForUpdate?.title}
                className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                type="text"
                placeholder="+855 12 345 678"
                id="title"
                {...register("phoneNumber", { required: "Title is required" })}
              />
            </div>
            <div>
              <div>
                <Label htmlFor="input">Address</Label>
                <input
                  // value={DocForUpdate?.title}
                  className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                  type="text"
                  placeholder="+855 12 345 678"
                  id="title"
                  {...register("address", { required: "Title is required" })}
                />
              </div>
            </div>
          </div>
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
                    {statusList.map(({ statusId, key, value }) => (
                      <SelectItem key={key} value={statusId.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <div className="space-y-6">
            <div>
              <Label>message</Label>
              <textarea
                // value={DocForUpdate?.title}
                className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                placeholder="+855 12 345 678"
                id="title"
                {...register("complaint", { required: "Title is required" })}
              />
            </div>
          </div>
        </ComponentCard>

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

          {clientImage && (
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
                      {clientImage.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(clientImage.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeClientImage}
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
        <div className="space-y-6 justify-end flex gap-5">
          <div className="space-y-6">
            <Button onClick={handleGoBack} size="md" variant="outline">
              Cancel
            </Button>
          </div>
          <div className="space-y-6">
            <Button size="md" variant="primary">
              Update Client
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddClientForm;
