'use client';

import QueryProviders from "@/providers/QueryProvider";
import PublicNavbar from "@/components/modules/Public/PublicNavbar";
import { Toaster } from "sonner";

export default function RootLayoutWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <html lang="en" className={className}>
      <body>
        <QueryProviders>
          <PublicNavbar />
          {children}
          <Toaster position="top-right" richColors />
        </QueryProviders>
      </body>
    </html>
  );
}
