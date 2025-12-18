import PageMeta from "../../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Input from "../../../utils/input/InputField.tsx";
import Label from "../../../components/form/Label.tsx";
import Select from "../../../components/form/Select.tsx";

import { useEffect, useState } from "react";
import { ServiceTypeOption } from "../../../model/ServiceType.tsx";
import TextArea from "../../../utils/input/TextArea.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import { ServiceItem } from "../../../model/Service.tsx";
import {
  GetService,
  postService,
  putService,
} from "../../../Service/ListServiceService.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { GetServiceType } from "../../../Service/ServiceTypeService.tsx";
import { request } from "@/constants/api.tsx";
import toast from "react-hot-toast";
type ServiceForUpdate = {
  basePrice: number;
  description: string;
  expertiseName: string;
  expertiseId: number;
  serviceId: number;
  serviceName: string;
  createdAt : string,
  updatedAt : string
};
const Service = () => {
  const { id } = useParams();

  const now = new Date()
  const [serviceForUpdate, setServiceForUpdate] = useState<ServiceForUpdate>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newService, setNewService] = useState<ServiceItem>({
    serviceId: 0,
    serviceName: "",
    description: "",
    basePrice: 0,
    expertiseId: 0,
    createdAt : "",
    updatedAt :""
  });
  useEffect(() => {
    const fetchData = async () => {
      const { payload } = await request(
        `services/${id}`,
        "GET",
        undefined,
        undefined
      );

      setServiceForUpdate(payload);
      setIsUpdating(true);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (isUpdating && serviceForUpdate) {
      setNewService({
        serviceId: Number(id),
        serviceName: serviceForUpdate.serviceName,
        description: serviceForUpdate.description,
        basePrice: serviceForUpdate.basePrice,
        expertiseId: serviceForUpdate.expertiseId,
        createdAt : serviceForUpdate.createdAt,
        updatedAt : now.toLocaleString.toString()
      });
    }
  }, [isUpdating, serviceForUpdate]);

  const navigation = useNavigate();

  const { refetch } = GetService();
  const { list } = GetServiceType();

  const option: ServiceTypeOption[] = list.map((item, index) => ({
    value: String(item.expertiseId ?? index),
    option: item.expertiseId,
    label: item.expertName || "",
  }));

  const handleSelectChange = (value: string) => {
    setNewService({ ...newService, expertiseId: Number(value) });
  };

  const handleOk = async () => {
    if (!newService.serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }

    const isCreate = newService.serviceId === 0;

    const loadingId = toast.loading(
      isCreate ? "Creating service..." : "Updating service..."
    );

    try {
      if (isCreate) {
        await postService(newService);
        toast.success("<p className='text-2xl'>Service created successfully</p>");
      } else {
        await putService(newService);
        toast.success("Service updated successfully");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (isCreate ? "Create failed" : "Update failed")
      );
    } finally {
      toast.dismiss(loadingId);
    }
    refetch();
    navigation("/list-service");
  };
  console.log("name ", serviceForUpdate); 

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Add Service" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOk();
        }}
      >
        <div className="space-y-6">
          <ComponentCard title="Form Service">
            <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label htmlFor="input">Service Name</Label>
                <Input
                  type="text"
                  placeholder="Enter service name"
                  id="input"
                  value={newService.serviceName}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      serviceName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Serivce Type</Label>
                <Select
                  options={option}
                  placeholder={serviceForUpdate?.expertiseName}
                  onChange={handleSelectChange}
                  // defaultValue={serviceForUpdate?.expertiseName}
                  className="dark:bg-dark-900"
                />
                {/*  */}
              </div>
            </div>
            <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <Label htmlFor="input">Base Price</Label>
                <Input
                  type="text"
                  placeholder="Enter base price"
                  id="input"
                  value={newService.basePrice}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      basePrice: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <TextArea
                  value={newService.description}
                  onChange={(value) =>
                    setNewService({ ...newService, description: value })
                  }
                  rows={6}
                />
              </div>
            </div>
          </ComponentCard>

          <div className="space-y-6 justify-end flex gap-5">
            <div className="space-y-6">
              <Button
                onClick={() => navigation("/service")}
                size="md"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
            <div className="space-y-6">
              <Button size="md" variant="primary" type="submit">
                {isUpdating ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Service;
