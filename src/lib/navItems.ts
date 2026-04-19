import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";


export const getCommonNavItems = (role : UserRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            // title : "Dashboard",
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                },
            ]
        },
        {
            title : "Settings",
            items : [
                {
                    title : "Change Password",
                    href : "change-password",
                    icon : "Settings"
                }
            ]
        }
    ]
}


export const contentManagerNavItems : NavSection[] = [
    {
        title: " Content Management",
        items : [
            {
                title : "My Contents",
                href : "/contentManager/dashboard/my-contents",
                icon : "Video"
            },
            {
                title: "Add Content",
                href: "/contentManager/dashboard/add-content",
                icon: "Plus",
            },
            {
                title: "Reviews",
                href: "/contentManager/dashboard/reviews",
                icon: "Star",
            },
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/dashboard/admins-management",
                icon: "Shield",
            },
            {
                title: "Content Managers",
                href: "/admin/dashboard/content-managers-management",
                icon: "Users",
            },
            {
                title: "Viewers",
                href: "/admin/dashboard/viewers-management",
                icon: "Users",
            },
        ],
    },
    {
        title: "Content Management",
        items: [
            {
                title: "All Contents",
                href: "/admin/dashboard/contents-management",
                icon: "Video",
            },
            {
                title: "Reviews",
                href: "/admin/dashboard/reviews-management",
                icon: "Star",
            },
        ],
    },
    {
        title: "Payment Management",
        items: [
            {
                title: "Payments",
                href: "/admin/dashboard/payments-management",
                icon: "CreditCard",
            },
        ],
    },
];

export const viewerNavItems: NavSection[] = [
    {
        title: "My Content",
        items: [
            {
                title: "Watchlist",
                href: "/dashboard/my-wishlist",
                icon: "Bookmark",
            },
            {
                title: "Subscriptions",
                href: "/dashboard/my-subscriptions",
                icon: "CreditCard",
            },
            {
                title: "Purchase History",
                href: "/dashboard/purchase-history",
                icon: "ShoppingCart",
            },
        ],
    },
    {
        title: "Reviews",
        items: [
            {
                title: "My Reviews",
                href: "/dashboard/my-reviews",
                icon: "Star",
            },
        ],
    },
];

export const getNavItemsByRole = (role : UserRole) : NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "CONTENT_MANAGER":
            return [...commonNavItems, ...contentManagerNavItems];

        case "VIEWER":
            return [...commonNavItems, ...viewerNavItems];
    }
}