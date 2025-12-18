import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";

import { CategoryRequest } from "@/model/Category";
import { useForm } from "react-hook-form";
import { postCategory } from "./CategoryOperation";

const PopUpAddCategory = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CategoryRequest>();

  async function handleCreateCate(data: CategoryRequest) {
    try {
      const res = await postCategory(data);
      console.log("new cate ", res);
      if (res?.success) {
        alert("Category success");
      }
    } catch (e) {
      console.error("Error ", e);
    }
  }
  return (
    <form onSubmit={handleSubmit(handleCreateCate)}>
      <div className="mt-4 w-150 ">
        <ComponentCard title="Create category">
          <div className="xl:col-span-2">
            <Label htmlFor="categoryName">Category name</Label>
            <input
              className="border-2 rounded-lg px-4 text-sm mt-4 py-2 w-full bg-black"
              type="text"
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
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PopUpAddCategory;
