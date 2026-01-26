import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";

import { CategoryInterface, CategoryRequest } from "@/model/Category";
import { useForm } from "react-hook-form";
import { postCategory, putCategoryById } from "./CategoryOperation";
import { useEffect, useState } from "react";
import { request } from "@/constants/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Button from "@/components/ui/button/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { Edit } from "iconsax-reactjs";

type CategoryProp = {
  categoryId?: number;
  isEditing: boolean;
  refetch: Function;
};

const PopUpAddCategory = ({ categoryId, isEditing, refetch }: CategoryProp) => {
  const [specificCategory, setSpecificCategory] = useState<CategoryInterface>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CategoryRequest>();

  // for get by id
  useEffect(() => {
    // ✅ CREATE MODE → do NOTHING
    if (!isEditing) {
      // setIsOpen(true)
      reset(); // empty form
      return;
    }

    // ✅ EDIT MODE but invalid ID → do NOTHING
    if (!categoryId || categoryId <= 0) {
      console.warn("Invalid categoryId for edit:", categoryId);
      return;
    }
    async function fetchCategoryById() {
      try {
        const res = await request(
          `categories/${categoryId}`,
          "GET",
          undefined,
          undefined,
        );
        // const
        setSpecificCategory(res?.payload);
      } catch (e) {
        console.error("ERROR ", e);
      }
    }
    if (specificCategory && isEditing) {
      reset({
        categoryName: specificCategory?.categoryName,
      });
    }
    fetchCategoryById();
  }, [isEditing === true]);
  // for create
  async function handleCreateCate(data: CategoryRequest) {
    try {
      const res = await postCategory(data);

      if (res?.success) {
        setIsOpen(false);
        refetch();

        alert("Category success");
      }
    } catch (e) {
      console.error("Error ", e);
    }
    refetch();
  }
  async function handleUpdateCate(data: CategoryRequest) {
    try {
      if (!categoryId) {
        console.error("Category ID is missing for update");
        return;
      }

      const res = await putCategoryById(data, categoryId as number);

      console.log("update ", res);
      if (res?.success) {
        setIsOpen(false);

        refetch();
        alert("Category success");
      }
    } catch (e) {
      console.error("Error ", e);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <DialogContent>HHh</DialogContent> */}
        {isEditing ? (
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            <Edit size="24" color="#ffffff" />
          </button>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            size="md"
            variant="primary"
            startIcon={<AiOutlinePlus className="size-5" />}
          >
            Create new category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        title=""
        className="w-full  content-center justify-center max-w-[95vw] rounded-3xl md:max-w-[90vw] lg:max-w-[50vw]"
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogHeader>
          <form
            onSubmit={handleSubmit(
              isEditing ? handleUpdateCate : handleCreateCate,
            )}
          >
            <div className="mt-4 w-150 ">
              <ComponentCard
                title={isEditing ? "Update Category" : "Create Category"}
              >
                <div className="xl:col-span-2">
                  <Label htmlFor="categoryName">Category name</Label>
                  <input
                    className="border-2 rounded-lg px-4 text-sm mt-4 py-2 w-full bg-black"
                    type="text"
                    defaultValue={specificCategory?.categoryName}
                    placeholder="Enter the category name"
                    id="categoryName"
                    {...register("categoryName", {
                      required: "Category name is required",
                    })}
                  />
                </div>
                {errors.categoryName && (
                  <p className="text-red-500 text-sm mt-1">
                    {" "}
                    {/* {errors.title.message} */}{" "}
                  </p>
                )}
              </ComponentCard>

              {/* PDF File Upload */}

              <div className="mt-4 justify-end flex gap-5">
                <div>
                  <button
                    // onClick={handleCancelUpdate}
                    type="submit"
                    // size=

                    className="text-[16px] hover:border-transparent hover:bg-green-600  hover:text-white transition-all duration-100 border border-amber-50 rounded-3xl px-6 py-1"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PopUpAddCategory;
