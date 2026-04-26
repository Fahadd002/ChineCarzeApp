"use client"

import StatsCard from "@/components/shared/StatsCard"
import { getDashboardData } from "@/services/dashboard.services"
import { ApiResponse } from "@/types/api.type"
import { IAdminDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"

const AdminDashboardContent = () => {
    const {data : adminDashboardData} = useQuery({
        queryKey: ["admin-dashboard-data"],
        queryFn: getDashboardData,
        refetchOnWindowFocus: "always" // Refetch the data when the window regains focus
    })

    const {data} = adminDashboardData as ApiResponse<IAdminDashboardData>;

    console.log(data);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatsCard
        title="Total Appointments"
        value={data?.appointmentCount || 0}
        iconName="CalendarDays"
        description="Number of appointments scheduled"
        />
        {/* <StatsCard
        title="Total Patients"
        value={data?.patientCount || 0}
        iconName="Users"
        description="Number of patients registered"
        /> */}
    </div>
  )
}

export default AdminDashboardContent