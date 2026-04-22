import DateCell from "@/components/shared/cell/DateCell";
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { IContentManager } from "@/types/contentManager.types";
import { ColumnDef } from "@tanstack/react-table";

export const managerColumns: ColumnDef<IContentManager>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Manager",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.profilePhoto}
      />
    ),
  },
  {
    id: "contactNumber",
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => <span className="text-sm">{row.original?.contactNumber || "N/A"}</span>,
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <span className="text-sm capitalize">{String(row.original.gender).toLowerCase()}</span>,
  },
  {
    id: "status",
    accessorKey: "user.status",
    header: "Status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.user?.status} />,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Joined On",
    cell: ({ row }) => <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />,
  },
];
