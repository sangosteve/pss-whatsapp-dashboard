import { v4 as uuidv4 } from "uuid";
import MenuItem from "./MenuItem";
import Search from "../Search/Search";
import { InboxIcon, Squares2X2Icon, DocumentTextIcon, UserGroupIcon, ArrowPathRoundedSquareIcon, Cog8ToothIcon, ChartBarIcon } from "@heroicons/react/24/outline"

interface MenuItem {
    id: string;
    title: string;
    href?: string;
    icon?: JSX.Element;
    subItems?: SubItem[];
}

interface SubItem {
    id: string;
    title: string;
    href: string;
}

const Sidebar: React.FC = () => {
    const items: MenuItem[] = [
        { id: uuidv4(), title: "dashboard", href: "/", icon: <Squares2X2Icon className="size-5 font-medium" /> },
        { id: uuidv4(), title: "inbox", href: "/inbox", icon: <InboxIcon className="size-5 font-medium" /> },
        {
            id: uuidv4(),
            title: "Message Templates",
            icon: <DocumentTextIcon className="size-5 font-medium " />,
            subItems: [
                { id: uuidv4(), title: "customers", href: "/customers" },
                { id: uuidv4(), title: "vendors", href: "/vendors" },
                { id: uuidv4(), title: "users", href: "/users" },
            ],
        },
        {
            id: uuidv4(),
            title: "Contacts",
            icon: <UserGroupIcon className="size-5 font-medium" />,
            subItems: [
                { id: uuidv4(), title: "customers", href: "/customers" },
                { id: uuidv4(), title: "vendors", href: "/vendors" },
                { id: uuidv4(), title: "users", href: "/users" },
            ],
        },

        {
            id: uuidv4(),
            title: "Automations",
            icon: <ArrowPathRoundedSquareIcon className="size-5 font-medium" />,
            subItems: [
                { id: uuidv4(), title: "customers", href: "/customers" },
                { id: uuidv4(), title: "vendors", href: "/vendors" },
                { id: uuidv4(), title: "users", href: "/users" },
            ],
        },
        { id: uuidv4(), title: "reports", href: "/reports", icon: <ChartBarIcon className="size-5 font-medium" /> },
        { id: uuidv4(), title: "settings", href: "/settings", icon: <Cog8ToothIcon className="size-5 font-medium" /> },

    ];

    return (
        <nav className="w-72 h-screen bg-white/50 px-2 scroll-auto border-r">

            <MenuItem items={items} />
        </nav>
    );
};

export default Sidebar;
