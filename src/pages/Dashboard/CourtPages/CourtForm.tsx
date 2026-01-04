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
import { CourtInterface, CourtRequest } from "@/model/Court.tsx";
import { courtTypeList } from "@/enum/CourtType.ts";
import {
  postNewCourtService,
  putCourtService,
} from "@/Service/CourtService.tsx";
import toast from "react-hot-toast";
// import { request } from "../../../constants/api.tsx";
const CourtForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const [specificCourt, setSpecificCourt] = useState<CourtRequest>();
  const backTo = useNavigate();

  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      courtName: "",
      courtType: "",
      location: "",
      contactNumber: "", // 👈 controlled from start
    },
  });

  function handleGoBack() {
    backTo("/list-court");
  }

  useEffect(() => {
    async function fetchClientById() {
      try {
        const res = await request(`courts/${id}`, "GET");
        const court = res.payload;

        setSpecificCourt(court);
        const courtTypeByKey = courtTypeList.find(
          (c) => c.key === court.courtType
        )?.key;

        reset({
          courtName: court.courtName,
          courtType: courtTypeByKey,
          location: court.location,
          contactNumber: court.contactNumber,
        });
      } catch (e) {
        console.error("Error ", e);
      }
    }
    fetchClientById();
  }, [id]);

  async function onAction(data: CourtRequest) {
    try {
      if (isEditing) {
        const courtId = Number(id);
        if (isNaN(courtId)) throw new Error("Invalid court id");

        await putCourtService(data, courtId);
        toast.success(`Update court with id ${courtId} successfully.`);
      } else {
        await postNewCourtService(data);
        toast.success(
          `Create new court with name ${data.courtName} successfully.`
        );
      }

      handleGoBack();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <div>
      <PageMeta
        title="Update Client"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Client Form" />
      <form onSubmit={handleSubmit(onAction)}>
        <div className="space-y-6">
          <ComponentCard title="Update Client">
            <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label htmlFor="input">Court Name</Label>
                <input
                  // value={DocForUpdate?.title}
                  className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                  type="text"
                  placeholder="Enter court name"
                  id="title"
                  {...register("courtName", { required: "Title is required" })}
                />
              </div>
              <div>
                <Label>location</Label>
                <input
                  // value={DocForUpdate?.title}
                  className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                  type="text"
                  placeholder="Enter court location"
                  id="title"
                  {...register("location", { required: "Title is required" })}
                />
              </div>
            </div>
            <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label>Contact Number</Label>
                <input
                  // value={DocForUpdate?.title}
                  className="border-2 rounded-lg px-4 bg-gray-900 py-2 w-full  focus:transition-all duration-150 delay-75"
                  type="text"
                  placeholder="+855 12 345 678"
                  id="title"
                  {...register("contactNumber", {
                    required: "Title is required",
                  })}
                />
              </div>
              <div className="space-y-6">
                <Label>Type Of Court</Label>

                <Controller
                  name="courtType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full min-h-11 ">
                        <SelectValue placeholder="Select court stype " />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>court type</SelectLabel>
                          {courtTypeList.map(({  key, value }) => (
                            <SelectItem key={key} value={key}>
                              {value}
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

          <div className="space-y-6 justify-end flex gap-5">
            <div className="space-y-6">
              <Button
                type="button"
                onClick={handleGoBack}
                size="md"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
            <div className="space-y-6">
              <Button size="md" type="submit" variant="primary">
                {!id ? "Create" : "Update"} court
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CourtForm;
