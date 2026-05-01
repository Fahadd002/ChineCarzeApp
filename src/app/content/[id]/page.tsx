import { notFound } from "next/navigation";
import { getContentById } from "@/services/content.services";
import { ContentDetailView } from "@/components/modules/Content/ContentDetailView";

interface ContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { id } = await params;
  
  // Move data fetching outside of try/catch that wraps JSX
  let contentData;
  let error = false;
  
  try {
    const response = await getContentById(id);
    if (!response.success || !response.data) {
      error = true;
    } else {
      contentData = response.data;
    }
  } catch (err) {
    console.error("Error loading content:", err);
    error = true;
  }
  
  // Handle not found or error after data fetching
  if (error || !contentData) {
    notFound();
  }
  
  // Return JSX outside of try/catch
  return <ContentDetailView content={contentData} />;
}