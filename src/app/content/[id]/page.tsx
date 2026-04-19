import { notFound } from "next/navigation";
import { getContentById } from "@/services/content.services";
import { ContentDetailView } from "@/components/modules/Content/ContentDetailView";

interface ContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { id } = await params;

  try {
    const response = await getContentById(id);

    if (!response.success || !response.data) {
      notFound();
    }

    return <ContentDetailView content={response.data} />;
  } catch (error) {
    console.error("Error loading content:", error);
    notFound();
  }
}