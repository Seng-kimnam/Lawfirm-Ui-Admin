import { useState } from "react";
import toast from "react-hot-toast";
import LawyerForm from "../LawyerForm";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      toast.success(`Lawyer profile for ${data.fullName} has been saved!`);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Example initial data from your dataset
  const initialData = {
    fullName: "Neang Panha",
    gender: "MALE" as const,
    lawyerStatus: "ACTIVE" as const,
    email: "panhaneang@gclaw-asia.com",
    phoneNumber: "077 296 768",
    title:
      "Head of Litigation & Dispute Resolution, Labor & Employment Practice",
    description:
      "Panha serves as the Executive Director of GCL and has a notable background in the judiciary landscape. He was previously a Council Member of the Bar Association of the Kingdom of Cambodia from 2021 to 2024...",
    expertises: ["Banking & Finance", "Litigation & Dispute Resolution"],
    facebookLink: "string",
    tiktokLink: "string",
    telegramLink: "string",
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lawyer Profile Management</h1>
          <p className="text-muted-foreground">
            Update and manage lawyer information
          </p>
        </div>
        <LawyerForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
