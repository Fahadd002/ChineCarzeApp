/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyContents } from "@/services/content.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Video, Users, Star } from "lucide-react";
import Link from "next/link";

const ContentManagerDashboard = () => {
  const { data: contents, isLoading } = useQuery({
    queryKey: ["my-contents"],
    queryFn: getMyContents,
  });

  const stats = [
    {
      title: "Total Contents",
      value: contents?.data?.length || 0,
      icon: Video,
      href: "/contentManager/dashboard/my-contents",
    },
    {
      title: "Total Views",
      value: contents?.data?.reduce((acc: number, content: any) => acc + (content.views || 0), 0) || 0,
      icon: Users,
      href: "/contentManager/dashboard/my-contents",
    },
    {
      title: "Average Rating",
      value: contents?.data && contents.data.length > 0
        ? (contents.data.reduce((acc: number, content: any) => acc + (content.averageRating || 0), 0) / contents.data.length).toFixed(1)
        : "0.0",
      icon: Star,
      href: "/contentManager/dashboard/reviews",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Manager Dashboard</h1>
        <Button asChild>
          <Link href="/contentManager/dashboard/add-content">
            <Plus className="h-4 w-4 mr-2" />
            Add New Content
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Contents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-20 w-full" />
              ))}
            </div>
          ) : contents?.data && contents.data.length > 0 ? (
            <div className="space-y-4">
              {contents.data.slice(0, 5).map((content: any) => (
                <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {content.posterUrl ? (
                      <img
                        src={content.posterUrl}
                        alt={content.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-muted rounded flex items-center justify-center">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{content.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {content.mediaType} • {content.releaseYear} • {content.views} views
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/content/${content.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No contents yet. Add your first content!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagerDashboard;
