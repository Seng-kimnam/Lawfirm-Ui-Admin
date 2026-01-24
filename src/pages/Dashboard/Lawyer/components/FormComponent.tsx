import { useState } from "react";
import toast from "react-hot-toast";
import LawyerForm from "../LawyerForm";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useNavigate } from "react-router";

const FormComponent = () => {
  const goto = useNavigate();

  return (
    <main className="min-h-screen rounded-3xl bg-transparent text-foreground pt-12">
      <button
        className="border  fixed top-24   border-white text-lg flex items-center gap-2 rounded-full
                   px-4 py-2 w-auto
                   text-white
                   hover:bg-white hover:text-black 
                   transition-colors duration-300 ease-in-out"
        onClick={() => goto("/list-lawyer")}
      >
        <ArrowLeft2 size="24" color="currentColor" />
      </button>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lawyer Profile Management</h1>
          <p className="text-muted-foreground">
            manage your lawyer information
          </p>
        </div>
        <LawyerForm />
      </div>
    </main>
  );
};
export default FormComponent;
